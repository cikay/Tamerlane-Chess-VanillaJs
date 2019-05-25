
var GameBoard={};// Oyun tahtası için nesne tanımlandı.
GameBoard.pieces= new Array(BRD_SQ_NUM);//karelerdeki taşların tutulduğu dizi.
GameBoard.side=COLOURS.WHITE;//oyunun başlangıcında sırasının beyazda olduğu tanımlandı.
GameBoard.hisPly=0;
GameBoard.history=[];
GameBoard.ply=0; //oyundaki hamle sayısının tutulduğu değişken.
GameBoard.material=new Array(2);
GameBoard.piecesNUMBER=new Array(100);//Oyundaki aynı taşların karışmaması için taşların numarsının tutulduğu dizi.
GameBoard.moveListStart=new Array(MAXDEPTH);//Olası hamlelerin tutulacağı dizinin index değerlerinin tutulduğu dizi.
GameBoard.pList= new Array(44*15); //Taşların bulunduğu kareleri tutan dizi
GameBoard.moveList=new Array(MAXDEPTH*MAXPOSITIONMOVES);//Olası hamlelerin tutulduğu dizi.
GameBoard.moveScores=new Array(MAXDEPTH*MAXPOSITIONMOVES);
GameBoard.PosKey=0;
GameBoard.WhiteKingsInGame=[PIECES.Wking];//Oyundaki beyaz şahlar
GameBoard.BlackKingsInGame=[PIECES.Bking];//Oyundaki siyah şahlar
GameBoard.WhiteHighestRanKING=PIECES.Wking;//Oyundaki en yüksek rütbeli beyaz şah
GameBoard.BlackHighestRanKING=PIECES.Bking;//Oyundaki en yüksek rütbeli siyah şah
GameBoard.WhiteCounter=0;//Beyaz şahların rakibin kalesine kaç kez girdiğini tutan değişken
GameBoard.BlackCounter=0;//Siyah şahların rakibin kalesine kaç kez girdiğini tutan değişken
GameBoard.WhiteOnlyKingInGame=PIECES.Wking;//Oyundaki tek beyaz şah
GameBoard.BlackOnlyKingInGame=PIECES.Bking;//Oyundaki tek siyah şah
GameBoard.WhitePceList=[];
GameBoard.BlackPceList=[];
GameBoard.Promhistory=[];
GameBoard.WswitchToEscapeSq=[];
GameBoard.BswitchToEscapeSq=[];



function CheckBoard(){

    var t_pceNum=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var t_material=[0,0];

    var sq112,t_piece,t_pce_num,sq270;

    for(t_piece=PIECES.WpOfPawn;t_piece<=PIECES.BadKing;t_piece++){
        for(t_pce_num=0;t_pce_num<GameBoard.piecesNUMBER[t_piece];t_pce_num++){
            sq270=GameBoard.pList[PCEINDEX(t_piece,t_pce_num)];
            if(GameBoard.pieces[sq270] != t_piece){

              console.log("error Pce lists");
              return Bool.False;

            }
        }
    }

    for(sq112=0;sq112<112;sq112++){

       sq270=SQ342(sq112);
       t_piece=GameBoard.pieces[sq270];
       t_pceNum[t_piece]++;
    }

    for(t_piece=PIECES.WpOfPawn;t_piece<=PIECES.BadKing;t_piece++){

        if(t_pceNum[t_piece] !=GameBoard.piecesNUMBER[t_piece]){

            console.log("error t_pcenum");
            return Bool.False;
        }
    }

    if(t_material[COLOURS.WHITE] != GameBoard.material[COLOURS.WHITE] ||
        t_material[COLOURS.BLACK] != GameBoard.material[COLOURS.BLACK]) {
        console.log('Error t_material');
        return Bool.False;
    }

    if(GameBoard.side!=COLOURS.WHITE && GameBoard.side!=COLOURS.BLACK) {
        console.log('Error GameBoard.side');
        return Bool.False;
    }

    if(GeneratePosKey()!=GameBoard.PosKey) {
        console.log('Error GameBoard.posKey');
        return Bool.False;
    }
    return Bool.True;
}

GeneratePosKey();
//Oyun tahtasını konsolda yazdırmak için gereken fonksiyon
function PrintBoard() {

    var sq,file,rank,piece;
//Sq:Kare numarası, file:Oyunun tahtasının sütun numarasını, rank: Oyunun tahtasının satır numarasını
//Piece: sq karesinde bulunan taşı tutmaktadır.

    console.log("\nTamerlane Chess\n");

    for (rank=Ranks.Rank_10;rank>=Ranks.Rank_1;rank--){
        var line=(RankChar[rank-1]+"        ");

        for(file=Files.Files_1;file<=Files.Files_11;file++){
//FR2SQ(file,rank) fonsiyonundaki förmül sayesinde satır ve sütun numarası girdileriyel karelerin numaraları hesaplandı.
            sq=FR2SQ(file,rank);
//Numarası hesaplanan karede bulunan taş
            piece=GameBoard.pieces[sq];
//181 numaralı KALE olarak adlandırılan karenin tahtada yer alması için
            if(rank==Ranks.Rank_9 && file==Files.Files_1){
                line=(RankChar[rank-1]+"       "+ PceChar[GameBoard.pieces[181]]);
            }
//Aralarında birer boşluk bırakılarak her taşın karşılık geldiği harf, line değişkenine eklendi.
//Taş bulunmayan karelerede piece=0’dır dolayısıyla PceChar[piece]=’-’ karakteri line değişkenine eklendi.
            line+=(" " + PceChar[piece] + " ");
//88 numaralı KALE olarak adlandırılan karenin tahtada yer alması için
            if(rank==Ranks.Rank_2 && file==Files.Files_11){
                line+=(" " + PceChar[GameBoard.pieces[88]] + " ");
            }
        }
        console.log(line);// Her döngünün sonunda bir satır yazdırılır.
    }
    console.log(" ");

    var line="      ";
//Sütunlar harflendirildi.
    for(file=Files.Files_0;file<=Files.Files_12;file++){
        line+=(" " + FileChar[file] + " "); //Sütun numarasına göre harf, line değişkenine eklendi.
    }

    console.log(line); //Line değişkeni ekrana yazıldı.
    console.log("side: " + SideChar[GameBoard.side]); //Hamle sırası hangi oyuncuda olduğu ekrana yazıldı.
    console.log("key: " + GameBoard.PosKey.toString(16))
}

function GeneratePosKey(){

    var sq=0;
    var finalKey=0;
    var piece=PIECES.EMPTY;

    for(sq;sq<BRD_SQ_NUM;sq++){
        piece=GameBoard.pieces[sq];
        if(piece != PIECES.EMPTY && piece !=SQUARES.OFF_BOARD){
            finalKey ^=PieceKeys[(piece*120)+sq];
        }
    }

    if(GameBoard.side==COLOURS.WHITE){
        finalKey ^=SideKey;

    }
    return finalKey;
}

function PrintPieceLists(){
    var piece,pceNum;
    for(piece=PIECES.WpOfPawn;piece<=PIECES.BadKing;piece++) {
        for (pceNum = 0; pceNum < GameBoard.piecesNUMBER[piece]; pceNum++) {
            //console.log(" ccc Piece: " + PceChar[piece] + " on " + PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)]));
            //console.log("mmm  "+PCEINDEX(piece, pceNum));
           //console.log("muzaffer  "+ GameBoard.piecesNUMBER[piece] );

        }
    }
}

function UpdateListsMaterial() {
    var piece,sq,index,colour;
//Taşların bulunduğu kareleri tutacak GameBoard.pList dizisinin tüm elemanları sıfırlandı.
    for (index = 0; index < 44 * 270; index++) {
        GameBoard.pList[index] = PIECES.EMPTY;
    }
    for (index = 0; index < 2; index++) {
        GameBoard.material[index] = 0;
    }
//Oyundaki her taşın sayısını tutan GameBoard.piecesNUMBER dizisinin tüm elemanları sıfırlandı.
    for (index = 0; index < 47; index++) {
        GameBoard.piecesNUMBER[index] = 0;
    }

    for(index=0;index<112;index++){

        sq=SQ342(index); //10*11 tahtanın tüm karelerinin numarası hesaplandı.

        piece=GameBoard.pieces[sq];//Hesaplanan karelerde bulanan taşlar piece değişkenenine atandı.


        if(piece != PIECES.EMPTY){//Piece değişkeni bir taşın numarası ise


            //Hesaplanan kare numarası, taş ve numarasına göre PCEINDEX aracılığıyla hesaplanan GameBoard.pList index değerine atandı.
            GameBoard.pList[PCEINDEX(piece,GameBoard.piecesNUMBER[piece])]=sq;
            GameBoard.piecesNUMBER[piece]++; //Oyundaki taşın sayısını tutan değer artırıldı.
        }
    }

    PrintPieceLists(); //Yukarıda oyun tahtasını konsola yazdıran fonsiyon çağrıldı.
}

function ResetBoard() {

    var index;
    for (index=0; index < BRD_SQ_NUM; index++) {
        GameBoard.pieces[index] = SQUARES.OFF_BOARD;
    }
    for (index = 0; index < 112; index++) {
        GameBoard.pieces[SQ342(index)] = PIECES.EMPTY;
    }
    GameBoard.PosKey = 0;
    GameBoard.side = COLOURS.BOTH;
    GameBoard.hisPly = 0;
    GameBoard.ply = 0;
    GameBoard.moveListStart[GameBoard.ply] = 0;
    GameBoard.WhiteKingsInGame=[PIECES.Wking];
    GameBoard.BlackKingsInGame=[PIECES.Bking];
    GameBoard.WhiteHighestRanKING=PIECES.Wking;
    GameBoard.BlackHighestRanKING=PIECES.Bking;
    GameBoard.WhiteCounter=0;
    GameBoard.BlackCounter=0;
    GameBoard.WhiteOnlyKingInGame=PIECES.Wking;
    GameBoard.BlackOnlyKingInGame=PIECES.Bking;
    GameBoard.WforkList=[];
    GameBoard.BforkList=[];
    GameBoard.WswitchToEscapeSq=[];
    GameBoard.BswitchToEscapeSq=[];

}

/*
*
* Taşların tahtaya dizilimi sırası*/
function ParseFen(fen){
    ResetBoard();
/*
*
* */
    var rank=Ranks.Rank_10;
    var file=Files.Files_11;
    var piece=0;
    var count=0;
    var i=0;
    var sq342=0;//Taşların bulunduğu kare numarası
    var fenCnt=0;//Taşların dizili olduğu fen string ifadenin indeksi.
/*

Taşları temsil eden harflerin dizili olduğu fen string ifadenin elemanlarının ait oldukları taşlar, GameBoard.pieces dizisine atanır.


* */
    while ((rank>=Ranks.Rank_1) && fenCnt < fen.length) {
        count=1;

        switch ((fen[fenCnt])) {

            case 'p' :piece=PIECES.BpOfPawn; break;
            case 'b' :piece=PIECES.BpOfElephant; break;
            case 'c' :piece=PIECES.BpOfCamel; break;
            case 'x' :piece=PIECES.BpOfWarengine; break;
            case 'r' :piece=PIECES.BpOfRook; break;
            case 'n' :piece=PIECES.BpOfKnight; break;
            case 't' :piece=PIECES.BpOfCatapult; break;
            case 'h' :piece=PIECES.BpOfGiraffe; break;
            case 'y' :piece=PIECES.BpOfMinister; break;
            case 'q' :piece=PIECES.BpOfKing; break;
            case 'e' :piece=PIECES.BpOfAdvisor; break;
            case 'f' :piece=PIECES.Belephant; break;
            case 'd' :piece=PIECES.Bcamel; break;
            case 'i' :piece=PIECES.Bwarengine; break;
            case 'k' :piece=PIECES.Brook; break;
            case 'a' :piece=PIECES.Bknight; break;
            case 'm' :piece=PIECES.Bcatapult; break;
            case 'z' :piece=PIECES.Bgiraffe; break;
            case 'g' :piece=PIECES.Bminister; break;
            case 's' :piece=PIECES.Bking; break;
            case 'v' :piece=PIECES.Badvisor; break;

            case 'P' :piece=PIECES.WpOfPawn; break;
            case 'B' :piece=PIECES.WpOfElephant; break;
            case 'C' :piece=PIECES.WpOfCamel; break;
            case 'X' :piece=PIECES.WpOfWarengine; break;
            case 'R' :piece=PIECES.WpOfRook; break;
            case 'N' :piece=PIECES.WpOfKnight; break;
            case 'T' :piece=PIECES.WpOfCatapult; break;
            case 'H' :piece=PIECES.WpOfGiraffe; break;
            case 'Y' :piece=PIECES.WpOfMinister; break;
            case 'Q' :piece=PIECES.WpOfKing; break;
            case 'E' :piece=PIECES.WpOfAdvisor; break;
            case 'F' :piece=PIECES.Welephant; break;
            case 'D' :piece=PIECES.Wcamel; break;
            case 'I' :piece=PIECES.Wwarengine; break;
            case 'K' :piece=PIECES.Wrook; break;
            case 'A' :piece=PIECES.Wknight; break;
            case 'M' :piece=PIECES.Wcatapult; break;
            case 'Z' :piece=PIECES.Wgiraffe; break;
            case 'G' :piece=PIECES.Wminister; break;
            case 'S' :piece=PIECES.Wking; break;
            case 'V' :piece=PIECES.Wadvisor; break;
//String ifadedeki sayılar o satırdaki boş kare sayısını ifade etmektedir. Dolayısıyla bu karelere PIECES.EMPTY değeri atanır.
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                piece=PIECES.EMPTY;
                count=fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;
// Eğer bu karekter, / karekteri ise sonraki satıra geçilir.
            case '/':
            case ' ':
                rank--;
//Satır sayısı 5'ten büyük olduğunda sütun numarası büyükten küçüğe doğru sıralanır, değilse
// küçükten büyüğe doğru sıralanır. Bunun nedeni Kale olarak adlandırılan fazla karelerdeki taşların GameBoard.pieces
// dizisine eklenmesidir.
                if(rank>=Ranks.Rank_5){ file=Files.Files_11; }
                else{ file=Files.Files_1; }
                fenCnt++;//satır sayısı artmasıyla indeks artırılır.
                continue;
            default:
////Bu seçeneklerden başka karekter iafdesi varsa hata mesajı ekrana yazılır.
                console.log("Fen ERROR");
                return;
        }
//Eğer string ifadedeki karekter taşları temsil eden harflerden biri ise count değişkeni 1 olarak kalır ve
//bu karakterin(taşın) satır ve sütun numarasına göre FR2SQ(file,rank) bulunduğu kare hesaplanır fonksiyonuyla hesaplanır.
        for(i=0;i<count;i++){

            sq342=FR2SQ(file,rank);
            GameBoard.pieces[sq342]=piece;

            if(rank>=Ranks.Rank_5){ file--; }
            else{ file++; }

        }
        fenCnt++; //sonraki karekter için indeks değeri artırılır.
    }
//fen string ifadesindeki harf w ise hale sırası beyazda,b ise siyahtadır.

    GameBoard.side=(fen[fenCnt]=='w') ? COLOURS.WHITE : COLOURS.BLACK;
    GameBoard.PosKey=GeneratePosKey();
    UpdateListsMaterial(); //fonksiyonu çağrıldı
    PrintSqAttacked(); //fonksiyonu çağrıldı

}
/*
*
* Tehdit altında olan kareleri ekrana yazdıran fonksiyon*/
function PrintSqAttacked() {
    var sq,file,rank,piece;

    console.log("Attacked: \n");
//Satır ve sütun numarakları for döngüsüne alındı
    for(rank=Ranks.Rank_10;rank>=Ranks.Rank_1;rank--){
//line değişkenine satır numarasının bir eksiği atandı.
        var line=((rank-1)+"       ");

        if(rank !=9) line+="   ";

        for(file=Files.Files_1;file<=Files.Files_11;file++){
//FR2SQ(file,rank) fonksiyonuna satır ve sütun numarası girdileriyle karelerin numarası hesaplanır.
            sq=FR2SQ(file,rank);
//satır numarası 9 ve sütun numarası 1 ise kale olarak adlandırılan kare tanımlanır.
            if( rank==9 && file==1){
//Bu karenin numarası 181'dir, eğer bu kare tehdit altında ise X, değilse - işareti sağına ve soluna boşluk
// bırakılarak line değişkenine atanır.
                if(SqAttacked(181,GameBoard.side)==Bool.True) piece="X";
                else piece="-";
                line+=(" "+piece+" ");

            }
//Eğer bu kare tehdit altında ise X, değilse - işareti sağına ve soluna boşluk
// bırakılarak line değişkenine atanır.
            if(SqAttacked(sq,GameBoard.side)==Bool.True) piece="X";
            else piece="-";

            line+=(" "+piece+" ");
//satır numarası 2 ve sütun numarası 11 ise kale olarak adlandırılan kare tanımlanır.
            if(rank==2 && file==11 ){
//Bu karenin numarası 88'dir, eğer bu kare tehdit altında ise X, değilse - işareti sağına ve soluna boşluk
// bırakılarak line değişkenine atanır.
                if(SqAttacked(88,GameBoard.side)==Bool.True) piece="X";
                else piece="-";

                line+=(" "+piece+" ");
            }
        }
//line değişkeni her satırın sonunda ekrana yazdırılır.
        console.log(line);
    }
}

//Karelerin tehdit altında olup olmadığını kontrol fonksiyon.
//Sq:Tehdit altında olup olmadığı kontrol edilemesi istenen kare numarası. Side:Sonraki hamlede oyun sırası gelecek oyuncu.
function  SqAttacked(sq,side){

    var pce,t_sq,index,direction;


    if(SquareIsNotCitadel(sq)==Bool.True ) {//Kare, KALE olarak adlandırılan karelerden biri değilse
//Oyuncunun geriye sadece bir şahı kalmışsa ve sıra kendisinde ise
        if ((side == COLOURS.WHITE && GameBoard.BlackKingsInGame.length == 1) ||
            (side == COLOURS.BLACK && GameBoard.WhiteKingsInGame.length == 1)) {
/*Beyaz taşlar ekranın aşağısında dizilmişse – Bu durumda beyaz piyonların hareket edecekleri karelerin numarası,
bulundukları kare numarasından daha büyük olmaktadır yani tehdit altında olup olmadığı kontrol edilen karenin
aşağı çaprazlarında beyaz piyonların olup olmadığı kontrol edilmektedir. Dolayısıyla bu kareden 14 ve 16 eksik olan
karelerde beyaz piyonların olup olmadığı kontrol edilmektedir.Siyah piyonların için durum haliyle tam tersindedir.
14 ve 16 fazla olan karelerde siyah piyonların olup olmadığı kontrol edilmektedir.*/
            if (Colors[IndexColorOfPlayer] == COLOURS.WHITE) {

                if (side == COLOURS.WHITE) { //Kareyi tehdit edip etmediği kontrol edilen taraf beyaz ise
/*//Bu karenin herhangi bir beyaz piyon tarafında tehdit altında olup olmadığı kontrol etmek için beyaz piyonlar döngüye alındı.*/
                    for (index = 0; index < WhitePawns.length; index++) {
/*Tehdit altın olup olmadığı kontrol edilmekte olan kare, herhangi bir beyaz piyonun çaprazında ise bu kare tehdit altındadır.
Dolayısıyla da fonsiyon Bool.True değerinde döndürülür. */
                        if (WhitePawns[index] == GameBoard.pieces[sq - 14] || WhitePawns[index] == GameBoard.pieces[sq - 16]) {

                            return Bool.True;
                        }
                    }
                }
                else if (side == COLOURS.BLACK) { //Kareyi tehdit edip etmediği kontrol edilen taraf siyah ise
//Bu karenin herhangi bir siyah piyon tarafında tehdit altında olup olmadığı kontrol etmek için siyah piyonlar döngüye alındı.
                    for (index = 0; index < BlackPawns.length; index++) {
/*Tehdit altın olup olmadığı kontrol edilmekte olan kare, herhangi bir beyaz piyonun çaprazında ise bu kare tehdit edilmektedir.
Dolayısıyla da fonsiyon Bool.True değerinde döndürülür.*/
                        if (BlackPawns[index] == GameBoard.pieces[sq + 14] || BlackPawns[index] == GameBoard.pieces[sq + 16]) {

                            return Bool.True;
                        }
                    }
                }
            }
//Beyaz taşlar ekranın yukarısında dizilmişse – bu durum yukarıdaki if bloğu için detaylı açıklanan açıklamanın tam tersidir.
            else if (Colors[IndexColorOfPlayer] == COLOURS.BLACK) {

                if (side == COLOURS.WHITE) { //Kareyi tehdit edip etmediği kontrol edilen taraf beyaz ise
//Bu karenin herhangi bir beyaz piyon tarafında tehdit altında olup olmadığı kontrol etmek için beyaz piyonlar döngüye alındı.
                    for (index = 0; index <WhitePawns.length; index++) {
/*Tehdit altın olup olmadığı kontrol edilmekte olan kare, herhangi bir beyaz piyonun çaprazında ise bu kare tehdit edilmektedir.
Dolayısıyla da fonsiyon Bool.True değerinde döndürülür.*/
                        if (WhitePawns[index] == GameBoard.pieces[sq + 14] || WhitePawns[index] == GameBoard.pieces[sq + 16]) {

                            return Bool.True;
                        }
                    }
                }
                else { //Kareyi tehdit edip etmediği kontrol edilen taraf siyah ise
//Bu karenin herhangi bir beyaz piyon tarafında tehdit altında olup olmadığı kontrol etmek için beyaz piyonlar döngüye sokuldu.
                    for (index = 0; index <BlackPawns.length; index++) {
//Tehdit altın olup olmadığı kontrol edilmekte olan kare, herhangi bir siyah piyonun çaprazında ise bu kare tehdit edilmektedir.
//Dolayısıyla da fonsiyon Bool.True değerinde döndürülür.

                        if (BlackPawns[index] == GameBoard.pieces[sq - 14] || BlackPawns[index] == GameBoard.pieces[sq - 16]) {

                            return Bool.True;
                        }
                    }
                }
            }

/*//At taşının sq karesini tehdit edip etmediği kontrol edilmektedir. Atın sq hamle yapabileceği herhangi bir karede
olup olmadığı kontrol edilmektedir. Bu yüzden atın bu kare ile hareket edebileceği kareler arasındaki farkları tutan
Knight_direction dizi döngüye alınmıştır. Böylece bu kareye bu kareye at tarafından hamle yapılabilecek karelerde
atın olup olomadığı kontrol edilmektedir.*/

            for (index = 0; index < Knight_direction.length; index++) { //at
//Tehdit altında olup olmadığı kontrol edilen kareye, atın hareket edebileceği kareler ile
//bulunduğu kare arasındaki farkları tutan dizisinin elemanları toplandı ve GameBoard.pieces dizisine index olarak girildi.
// GameBoard.pieces dizisi aracılığıyla bu hesaplanan karede olan taş pce değişkenine atandı.
                pce = GameBoard.pieces[sq + Knight_direction[index]];
//Bu değişken at ve tehdit edip etmediği tarafın taşı ise bu kare at tarafından tehdit edilmektedir.
//Fonksiyon Bool.True değerini döndürülür.

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceKnight[pce] == Bool.True) {
                    return Bool.True;
                }
            }
/*Deve, Fil, Debbabe, Vezir, General taşları için aynı şekilde bu kontrol ve hesaplamalar yapılmaktadır.
Dolayısıyla bu taşlar için ayrıca açıklama yapılmamıştır.*/
            for (index = 0; index < Camel_direction.length; index++) { //deve

                pce = GameBoard.pieces[sq + Camel_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceCamel[pce] == Bool.True) {
                    return Bool.True;
                }
            }
            for (index = 0; index < Catapult_direction.length; index++) { //FİL

                pce = GameBoard.pieces[sq + Catapult_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceElephant[pce] == Bool.True) {
                    return Bool.True;
                }
            }
            for (index = 0; index < Advisor_direction.length; index++) { //VEZİR

                pce = GameBoard.pieces[sq + Advisor_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceAdvisor[pce] == Bool.True) {
                    return Bool.True;
                }
            }
            for (index = 0; index < Minister_direction.length; index++) { //GENERAL
                pce = GameBoard.pieces[sq + Minister_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceMinister[pce] == Bool.True) {
                    return Bool.True;
                }
            }


            for (index = 0; index < Warengine_direction.length; index++) { //DEBBABE

                pce = GameBoard.pieces[sq + Warengine_direction[index]];

                if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceWarengine[pce] == Bool.True) {
                    return Bool.True;
                }
            }

/*Zürafa, Kale ve Mancınık taşlarının hareketi yukarıda yazılan taşlardan farklı biçimde gerçekleştiğinden bu açıklamalar gerekli görülmüştür.

sq karesini zürafanın tehdit edip etmediği kontrol edilmektedir.
*/
            for (index = 0; index < Giraffe_direction.length; index++) { //zürafa
//sq karesin tehdit edecek herhangi bir zürafanın olup olmadığını konktol etmek için, zürafanın olabileceği kareler hesaplanmaktadır.
//Giraffe_direction dizisinin elemanlarıyla zürafanın hamle yapabileceği kareler ile bulunduğu kare arasındaki fark değeri direction değişkenine atanmıştır.
                direction = Giraffe_direction[index];
//sq + direction numaralı karede zürafa taşının olup olmadığı kontrol edilecek. Bunun için bu karedeki taş pce değişkenine atandı.
                t_sq = sq + direction;
                pce = GameBoard.pieces[t_sq];
/*Sq karesinin Zürafa tarafından tehdit edilebilmesi için sq karesi yönündeki üç karenin boş olması gerekir. İlki zürafanın çaprazındaki kare,
İkincisi ve üçüncüsü sırasıyla zürafanın konumuna göre atın ve devenin hamle yapabileceği kareler boş olmalıdır.
Bu if bloğuyla ikinci ve üçüncü karelerin boş olup olmadığı kontrol edilmektedir. İlk karenin boş olup olmaması
while döngüsünün içinde kontrol edilmektedir. Bunun nedeni t_sq karesi boş ise zürafa bu karenin aşağısında, yukarısında, sağında
ya da solunda olabilir.
*/
                if (GameBoard.pieces[t_sq - Knight_direction[index]] == PIECES.EMPTY && GameBoard.pieces[t_sq - Camel_direction[index]] == PIECES.EMPTY) {
//hesaplanan t_sq karesindeki taş tanımlanan taşlardan biri olduğu sürece döngü çalışır.
                    while (pce != SQUARES.OFF_BOARD) {
//Zürafanın çaprazındaki karede taş yoksa yani boş ise.
                        if (GameBoard.pieces[t_sq - Giraffe3_direction[index]] == PIECES.EMPTY) {
//Pce taşı 0 değilse yani herhangi bir taş ise
                            if (pce != PIECES.EMPTY) {
//Pce taşı zürafa ve tehdit eden tarafın taşı ise sq karesi tehdit altındadır.
                                if (PieceGiraffe[pce] == Bool.True && PieceColor[pce] == side) {

                                    return Bool.True;
                                }
                            }
//pce 0 ise yani herahngi bir taş değilse t_sq karesi yeniden hesaplanır, hesaplanan karedeki taş pce
//değişenine atanır While dönngüsünün sonraki adımına geçilir.
                            t_sq += Giraffe2_direction[index];
                            pce = GameBoard.pieces[t_sq];
                        } else {
//Eğer t_sq karesinin çaprazındaki karede herhangi bir taş varsa sq karesi zürafa tarafından tehdit edilemez.While döngüsünden çıkılarak
//sonraki yön için aynı işlemeler yapılır.
                            break;
                        }
                    }
                }
            }
/*Sq karesinin kale tarafında tehdit altın olup olmadığı kontrol edilmektedir.
Kalenin hareket edeceği yönler vezir ile aynı olduğundan kale için ayrıca yön dizisi tanımlanmasına gerek duyulmamıştır.
Sq karesine her seferinde Advisor_direction dizisinin bir elemanın eklenip hesaplanan karedeki taş pce değişkenine atanır.
*/
            for (index = 0; index < Advisor_direction.length; index++) { //KALE
                direction = Advisor_direction[index];
                t_sq = sq + direction;
                pce = GameBoard.pieces[t_sq];
//Eğer bu pce taşı SQUARES.OFF_BOARD’e eşit değilse döngüyü sürdür.Bu durum, pce taşının bulunduğu karenin 10*11 tahtasının sınırları
//içerisinde olduğu anlamına gelmektedir.
                while (pce != SQUARES.OFF_BOARD) {
//pce taşının numarası sıfır değilse bu karede bir taş var demektir.
                    if (pce != PIECES.EMPTY) {
/*Bu karedeki taş kale ve tehdit edip etmediği kontrol eden tarafın taşı ise
sq karesi kale tarafından tehdit altındadır. Dolayısıyla fonksiyon Bool.True değerini döndürür.*/
                        if (PieceRook[pce] == Bool.True && PieceColor[pce] == side) {

                            return Bool.True;
                        }
/*Bu karedeki taş kale veya tehdit edip etmediği kontrol eden tarafın taşı değilse WHİLE döngüsünden çık,
KALE’nin hareket edeceği diğer yönler için for döngüsünün diğer değeri için işlemi tekrarla.*/
                        break;
                    }
/*pce taşının numarası sıfır ise bu karede taş yok demektir. Bu yönde 10*11 tahtanın sınırları
içerisinde olduğu sürece her seferinde yeni kareye bu yöndeki sayıyı ekle ve bu karedeki taşın
kale ve renginin tehdit edilmesi beklenen tarafın taşı olup olmadığı kontrol et. */
                    t_sq += direction;
                    pce = GameBoard.pieces[t_sq];
                }
            }
/*Sq karesinin mancınık tarafından tehdit edilip edilmediği kontrol edilmektedir.
Mancınığın bulunduğu kare ile hamle yapabileceği yönlerdeki karelerin farkının tutulduğu
Catapult_direction dizisi döngüye alınmıştır. Dizinin elemanları sırasıyla sq karesine
eklenip t_sq değişkenine atanmıştır. Daha sonra bu karede bulunan taş pce değişkenine atanmıştır. */
            for (index = 0; index < Catapult_direction.length; index++) { //mancınık

                direction = Catapult_direction[index];
                t_sq = sq + direction;
                pce = GameBoard.pieces[t_sq];
/*Mancınığın hareket edebilmesi için t_sq karesinin çaprazı boş olması gerekmektedir.
Bu yüzden Minister_direction dizisnin index elemanı çıkarılıp hesaplanan karenin boş olup olmadığı kontrol edilmektedir. */
                if (GameBoard.pieces[t_sq - Minister_direction[index]] == PIECES.EMPTY) { //Bu kare boş ise
/*Eğer bu pce taşı SQUARES.OFF_BOARD’e eşit değilse döngüyü sürdür. Bu durum, pce taşının bulunduğu karenin
 10*11 tahtasının sınırları içerisinde olduğu anlamına gelmektedir.*/
                    while (pce != SQUARES.OFF_BOARD) {

                        if (pce != PIECES.EMPTY) { //Eğer bu t_sq karesi boş değilse
//Bu karede mancınık varsa ve side oyuncunun taşı ise sq karesi tehdit altındadır.
                            if (PieceCatapult[pce] == Bool.True && PieceColor[pce] == side) {

                                return Bool.True;
                            }
/*Bu karede taş mancınık değilse ya da side oyuncunun taşı değilse WHİLE döngüsünü kır,
MANCINIK’nin hareket edeceği diğer yönler için for döngüsünün diğer değeri için işlemi tekrarla.*/
                            break;
                        }
                        t_sq += Minister_direction[index];
/*Eğer t_sq karesi boş ise bu kareye Minister_direction dizisinin indeksinci elemanını
ekle t_sq karesinin çaprazındaki kareyi hesaplamak için.
Daha sonra güncel t_sq karesindeki taş pce değişkenine atanır
ve WHİLE döngüsünün başa alınarak aynı işlemler tekrarlanır
*/
                        pce = GameBoard.pieces[t_sq];
                    }
                }
            }
        }
    }

    for (index = 0; index < King_direction.length; index++) { //SAHlar
        pce = GameBoard.pieces[sq + King_direction[index]];


        if (pce != SQUARES.OFF_BOARD && PieceColor[pce] == side && PieceKing[pce] == Bool.True) {

            return Bool.True;
        }
    }

//Sq karesi hiçbir taş tarafından tehdit edilmiyorsa fonsiyonu Bool.False değerinde döndürülür.
    return Bool.False;
}


