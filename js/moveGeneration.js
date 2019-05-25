
/*Karelerin 10*11 tahtanın içinde olduğunu kontrol eden fonksiyon */
function SQOFFBOARD(sq) {
    if(FilesBrd[sq]==SQUARES.OFF_BOARD){
        return Bool.True;
    }
    return Bool.False;
}

/*Move fonksiyonu olası hamlerin tüm değişkenlerini tutan sayıyı hesaplayıp bu sayıyı döner,
from:Hamle yapacak taşın bulunduğu kare numarası, to:Hamlenin yapılacağı kare,
captured:Alınan taş, promoted:Piyonların terfi, flag:Bazı durumlarda diğer hamlelerin yapılması için gerekli değişken. */
function MOVE(from,to ,captured,promoted, flag) {

    return ( from | (to <<8) | (captured <<16) | (promoted<<22) | flag);

}

/*AddCaptureMove fonksiyonu, Move fonsiyonunun ile dönülen sayıyı GameBoard.moveList dizisinde saklar.
Böylece taş alınan olası tüm hamleler bu dizide bu fonsiyon sayesinde saklanır.*/
function AddCaptureMove(move){
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]]=move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++]=0;
}
/*AddQuietMove fonksiyonu, AddCaptureMove fonksiyonu ile aynı şekilde çalışır.
AddCaptureMove fonsiyonu oyundan taş alınan olası tüm hamleleri GameBoard.moveList dizisine atama yaparken,
AddQuietMove fonksiyonu taş alınmayan olası tüm hamleleri aynı diziye atama yapar. */
function AddQuietMove(move){
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.ply+1]]=move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.ply+1]++]=0;
}

/*
Piyonlar, rakibin herhangi bir taşını alması durumunda hamlenin değişkenlerini tutan değişkenin
hesaplanıp GameBoard.moveList dizisine atanmanın yapıldığı fonksiyon, from:Piyonun bulunduğu kare numarası,
to:Piyonun hamle yapacağı kare numarası, cap:Piyon tarafında oyundan alınan taş.
MOVE fonksiyonu aracılığıyla hesaplanan(hamlenin tüm değişkenlerinin tutulduğu)
değişken, AddCaptureMove fonksiyonuyla olası hamlelerin listelendiği GameBoard.moveList dizisine
atanır.*/

function AddPawnCaptureMove(from,to,cap){
//Piyonun piyonu üçüncü kez terfi olması için bulunduğu kareler hesaplanır.
    var WpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)]];//Beyaz oyuncunun piyonun piyonunun bulunduğu kare
    var BpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)]];//Siyah oyuncunun piyonun piyonunun bulunduğu kare
/*Oyuncunun piyonunun piyonu iki kez terfi edilmişse ve şuanda bulunduğu kare terfi edilmesi gereken satırda ise(bu koşul terfi sayısı
2 olduğu tüm durumlarda bu koşulun sağlanmaması içindir)// piyonun piyonu
3. kez terfi olmak için şahın piyonunun başlangıç karesine hamle yapması için MFLAGTOBEADKING değeri atanmıştır. Bu durum iki
oyuncu için de geçerli olduğundan ayrı ayrı açıklama yapılmamıştır. */
    if((wPromNumPofP==2 && WpiyonP_rank==WpromotionRank ) ||
        (bPromNumPofP==2 && BpiyonP_rank==BpromotionRank)) {

        AddCaptureMove(MOVE(from, to, cap, 0, MFLAGTOBEADKING));
    }
//Piyonlar terfi olması için gerçekleşmesi gereken koşullar
    else if( (RanksBrd[from]==WfromRank && GameBoard.side==COLOURS.WHITE) ||
        (RanksBrd[from]==BfromRank && GameBoard.side==COLOURS.BLACK)) {

        AddCaptureMove(MOVE(from,to,cap,1,0));

    }
//Piyonların terfi olmadığı durumlar
    else {   AddCaptureMove(MOVE(from,to,cap,0,0)); }

}

/*Piyonların taş almadığı hamlelerde, hamlenin tüm değişkenlerini tutan değişkenin hesaplanıp GameBoard.moveList dizisine
atama yapan fonksiyon. MOVE fonksiyonu aracılığıyla hesaplanan(hamlenin tüm değişkenlerinin tutulduğu)
değişken, AddQuietMove fonksiyonuyla olası hamlelerin listelendiği GameBoard.moveList dizisine
atanır. Diğer kısımlar AddPawnCaptureMove fonsiyonuyla benzer olduğu için açıklama yapılmaya gerek duyulmamıştır.

*/
function AddPawnQuietMove(from,to){

    var WpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)]];
    var BpiyonP_rank=RanksBrd[GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)]];

    if((wPromNumPofP==2 && WpiyonP_rank==WpromotionRank) ||
        (bPromNumPofP==2 &&BpiyonP_rank==BpromotionRank)){

        AddQuietMove(MOVE(from,to,PIECES.EMPTY,0,MFLAGTOBEADKING));
    }
    else if( (RanksBrd[from]==WfromRank && GameBoard.side==COLOURS.WHITE) ||
        (RanksBrd[from]==BfromRank && GameBoard.side==COLOURS.BLACK)){

        AddQuietMove(MOVE(from,to,PIECES.EMPTY,1,0));

    }else{   AddQuietMove(MOVE(from,to,PIECES.EMPTY,0,0)); }
}

/*Piyonların düz ileriye doğru hamle yapabilmelerini kontrol eden fonksiyon.*/
function PawnAttackedSqStraight(sq,side){
/*Düz hamlenin yapılması için hamle yapılacak olan karenin boş olması, side değişkeni oyun sırası olan oyuncun olması ve
sq karesinin Kale olarak adlandırılan karelerden biri olmaması. Bu durumda fonksiyon Bool.True değeri dönerek
hamlenin yapılabilir olduğunu bildirir, aksi halde hamle yapılamaz.
* */
    if (GameBoard.pieces[sq] == PIECES.EMPTY  && GameBoard.side==side && SquareIsNotCitadel(sq)==Bool.True) {

        return Bool.True;
    }
    return Bool.False;
}

/*
Beyaz piyonların çapraz karelere hamle yapabilip yapamayacaklarını kontrol eden fonksiyon.
Girdi olan sq değişkeni 10*11 tahtanın dışında değilse, hamle sırası beyaz oyuncudaysa,
sq karesinde siyah oyuncunun taşı varsa ve sq karesi Kale olarak adlandırılan karelerden biri
değilse beyaz oyuncunun piyonu çapraz kareye hamle yapabilir.
*/
function PawnAttackedSqDiagonalWhite(sq){

    if (SQOFFBOARD(sq) == Bool.False && GameBoard.side==COLOURS.WHITE
        && PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK && SquareIsNotCitadel(sq)==Bool.True )  {

        return Bool.True;

    }
    return Bool.False;
}
/*Siyah piyonların çapraz karelere hamle yapabilip yapamayacaklarını kontrol eden fonksiyon.
Girdi olan sq değişkeni 10*11 tahtanın dışında değilse, hamle sırası siyah oyuncudaysa,
sq karesinde beyaz oyuncunun taşı varsa ve sq karesi Kale olarak adlandırılan karelerden biri
değilse siyah oyuncunun piyonu çapraz kareye hamle yapabilir.
*/
function PawnAttackedSqDiagonalBlack(sq){
    if (SQOFFBOARD(sq) == Bool.False && GameBoard.side==COLOURS.BLACK &&
        PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE && SquareIsNotCitadel(sq)==Bool.True )  {
        return Bool.True;
    }
    return Bool.False;
}


/*
* Oyuncuların oyunda sadece bir şahı varsa ve bu şah tehdit altındaysa
* oyuncu bir defaya mahsus şahı herhangi bir oyuncu ile yerdeğiştirebilir.
* SoleKingSwitchPlaceWithAnyPiece fonksiyonu bu hamlenin hesaplandığı fonksiyondur.
*/

function SoleKingSwitchPlaceWithAnyPiece() {
    var piece,sq,index;
/*
* Beyaz oyuncunun oyundaki tek şahın bulunduğu kare WsqOfsoleKing değişkenine, siyah oyuncununki
* BsqOfsoleKing değişkenine atanır.
* * */
    var WsqOfsoleKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
    var BsqOfsoleKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];
/*
Hamle sırası beyaz oyuncuda, beyaz oyuncunun oyundaki son şahın değerini tutan
GameBoard.WhiteOnlyKingInGame değişkeni sıfır değilse, bu şah tehdit altındaysa,
WsoleKingSwitchPlacePiece değişkeni sıfır ise(bu hamle yapılmadığı anlamına gelmektedir)
bu hamle yapılabilir.
*/
    if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteOnlyKingInGame!=0 &&
        SqAttacked(WsqOfsoleKing,GameBoard.side^1)==Bool.True && WsoleKingSwitchPlacePiece==0){
/*Tahtanın tüm kareleri taranıp beyaz taş bulunan tüm kareler kontrol edilir.*/
        for(index=0;index<110;index++){
/*karelerin numarası daha önce hesaplanıp sq112to342 dizisine atanmıştı, SQ342 fonksiyonuyla bu dizi
çağrılıp index değerine göre karelerin numarası sq değişkenine atanır.
*
* */
            sq=SQ342(index);
/*Bu karelerde bulunan taşlar piece değişkenine atanır. */
            piece=GameBoard.pieces[sq];
/*piece değişkeni beyaz oyuncunun taşı ve sq karesi tehdit altında değilse bu kareye hamle
yapılabilir.*/
            if(PieceColor[piece]==COLOURS.WHITE && SqAttacked(sq,GameBoard.side^1)==Bool.False){

                AddQuietMove(MOVE(WsqOfsoleKing,sq,PIECES.EMPTY,0,MFLAGSWITCHANYPIECE));

            }
        }
    }

    else if(GameBoard.side==COLOURS.BLACK && GameBoard.BlackOnlyKingInGame!=0 &&
        SqAttacked(BsqOfsoleKing,GameBoard.side^1)==Bool.True && BsoleKingSwitchPlacePiece==0){

        for(index=0;index<110;index++){

            sq=SQ342(index);

            piece=GameBoard.pieces[sq];

            if(PieceColor[piece]==COLOURS.BLACK && SqAttacked(sq,GameBoard.side^1)==Bool.False){

                AddQuietMove(MOVE(BsqOfsoleKing,sq,PIECES.EMPTY,0,MFLAGSWITCHANYPIECE));

            }
        }
    }
}

/*
* ForkingAndImmobile fonksiyonu çatallama ve mahkum taş hamlelerini hesaplar.
*
* */

function ForkingAndImmobile() {
/*
* Bu hamleler yapılabilmesi için oyuncunun ya oyunda biden fazla şhı olmalı ya da
* oyundaki son şahı tehdit altında olmamalıdır. WsqOfOnlyKing değişkenine beyaz oyuncunun saon şahının
* bulunduğu karenin numarası, BsqOfOnlyKing değişkenine ise siyah oyuncununki atanır.
* */
    var WsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
    var BsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];
    var rank,file,Windex=0,Bindex=0,sq,sq1,sq2,diagonal,fork_sq;
    var index;
    var PceList;
    var piece;
    var ImmobilePceList=[];
    var movingPceList=[];
    var move;
/*
* Beyaz oyuncunun piyonunun piyonunun bulunduğu karenin numarası WsqOfPofP değişkenine, siyah oyuncununki
* BsqOfPofP değişkenine atanır.
* */
    var WsqOfPofP=GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)];
    var BsqOfPofP=GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)];
/*
* Beyaz oyuncunun piyonunun piyonunun terfi sayısı bir(wPromNumPofP==1), piyonun piyonu terfi olması gereken
* satırda(RanksBrd[WsqOfPofP]==WpromotionRank), beyaz oyuncunun oyudaki son şahı tehdit
 * altında değil(SqAttacked(WsqOfOnlyKing,COLOURS.BLACK)==Bool.False) ise beyaz oyuncu çatallama ya da mahkum taş etme hamleleri
 * yapılabilir. Bu hamlelerin değişkenlerinin hesaplanıp GameBoard.moveList dizisine atanması aşağıda açıklanmıştır.
* */
    if(wPromNumPofP==1 && RanksBrd[WsqOfPofP]==WpromotionRank &&
        GameBoard.side==COLOURS.WHITE && SqAttacked(WsqOfOnlyKing,COLOURS.BLACK)==Bool.False){

/*Karelerin numarası; sq112to342 dizine atanmış, SQ342 fonksiyonuyla döndürülümüştü. Dolayısıyla karelerin numarası
* SQ342 fonksiyonuyla elde edilebilir. Bunun için bir for döngüsü yeterlidir.*/
        for(index=0;index<112;index++){
/*Bu arada index değeri, SQ342 fonksiyonun içinde sq112to342 dizisine indeks değeri olarak atanır.
 * Böylece bu indeks değerindeki kare numarası alınıp sq değişkenine atanır. */
            sq=SQ342(index);
/*Eğer bu sq karesinde bulunan taşın rengi siyah ise */
            if(PieceColor[GameBoard.pieces[sq]] == COLOURS.BLACK){
/*sq kare numarası siyah taşların tutulduğu GameBoard.BlackPceList dizisine atanır.*/
                GameBoard.BlackPceList[Bindex]= sq;
                Bindex++;
            }
        }

        console.log(GameBoard.BlackPceList);
/*Eğer beyaz taşlar ekranda aşağıda dizilmişse(düşük numaralı karelere) çatallama karesinin hesaplanması için diagonal
* değişkenine 16 değeri atanır. Çünkü iki taşı çatallamaya alacak olan taş, iki taştan kare numarası büyük olan taşa göre
* hesaplanıp bu taşın sol çaprazındaki kare numarası hesaplanakatır. Bu iki kare arasındaki fark ise 16'dır.*/
        if(Colors[IndexColorOfPlayer]==COLOURS.WHITE) diagonal=16;
/*Eğer beyaz taşlar ekranda yukarıda dizilmişse(büyük numaralı karelere) çatallanalacak olana iki taşın bullundukları karelerden
* sol taraftaki daha büyük numaralıdır. Çatallama yapacak olan kare ise bu ikisin ortasında yukarıda yer alır. Yani
* büyük numaralı karenin yukarı sağ çağrazındadır. Çatallanacak olan karlerden büyük olanın numarası, çatallama yapacak olan
* karenin numarasından 14 küçük olur. Bu yüzden diagonal değişkeni -14 olarak belirlenir. */
        else diagonal=-14;

/*Siyah taşlara çatallama yapılıp yapılamayacağını kontrol etmek için bu taşların kare numarası hesaplananark iki taş arasındaki
* fark abakılır. Eğer bu fark iki ve bu iki kare aynı satırda yer alıyorsa bu karelerde bulunan taşlara çatallama yapılır.*/
        for(index=0;index<GameBoard.BlackPceList.length;index++){
/*Siyah taşların arasında iki kare fark olan taşlar çatallanabilir dolayısıyla bu taşalrın bulundukları kareleri hesaplamak
için GameBoard.BlackPceList dizisinin index değerindeki kare numarası, index+1 değerindeki kare
kare numarasından 2 çıkarılarak karşılaştırılır. Bu kare numaraları birbirine eşit ise çatallama yapacak karenin numarası
GameBoard.BlackPceList[index+1] değerine göre hesaplanır.
Bu kareler birbirine eşit değilse index ile index+2 indekslerindeki kareler birbiriyle karşılaştırılır.
Bu kare numaraları birbirine eşit ise çatallama yapacak karenin numarası GameBoard.BlackPceList[index+2]
değerine göre hesaplanır. Bu iki durumda da eşitlik sağlanmazsa döngünün saonraki adımına geçilir.

.*/

            sq=GameBoard.BlackPceList[index];
            sq1=GameBoard.BlackPceList[index+1]-2;
            sq2=GameBoard.BlackPceList[index+2]-2;


            if(sq==sq1 && RanksBrd[sq] == RanksBrd[sq1]) fork_sq=GameBoard.BlackPceList[index+1]-diagonal;
            else if(sq==sq2 && RanksBrd[sq]==RanksBrd[sq2]) fork_sq=GameBoard.BlackPceList[index+2]-diagonal;
            else continue;

/*Hesaplanan çatallama karesi(fork_sq) 10*11 tahtanın dışında değilse ve bu karedeki taş rakibin oyundaki tek şahı değilse
* */
            if(RanksBrd[fork_sq]!=SQUARES.OFF_BOARD && GameBoard.pieces[fork_sq]!=GameBoard.BlackOnlyKingInGame){
//Bu kare boş değilse
                if (GameBoard.pieces[fork_sq] != PIECES.EMPTY ) {

//Bu kareye hamle yapılabilir.
                    AddCaptureMove(MOVE(WsqOfPofP,fork_sq,GameBoard.pieces[fork_sq],PIECES.EMPTY,0));

                }
                else {//Bu karede herhangi bir taş yoksa bu kareye hamle yapılabilir.

                    AddQuietMove(MOVE(WsqOfPofP,fork_sq,PIECES.EMPTY,PIECES.EMPTY,0));
                }

            }
        }
/*Mahkum taşları tespit etmek ve bu taşı sonraki hamlede alınacak şekilde piyonun piyonunu bu taşların çaprazına
* yapılacak hamlelerin hesaplanması.
*/
        for(index=GameBoard.moveListStart[GameBoard.ply-1];
            index<GameBoard.moveListStart[GameBoard.ply];index++){

            move=GameBoard.moveList[index];

            if(movingPceList.indexOf(FROMSQ(move))==-1) {

                movingPceList.push(FROMSQ(move));

            }
        }

        console.log("tüm taşlar "+GameBoard.BlackPceList);
        console.log("hareket eden taşlar "+movingPceList);

        PceList=GameBoard.BlackPceList.concat(movingPceList);

        console.log(PceList);


        for(index=0;index<GameBoard.BlackPceList.length;index++){

            piece=PceList[index];
            if(PceList.indexOf(piece)==PceList.lastIndexOf(piece)){

                ImmobilePceList.push(piece)
            }

        }

        console.log(ImmobilePceList);

        for(index=0;index<ImmobilePceList.length;index++){

            for(j=0;j<PawnDiagonal.length;j++){

                ImmobileSq=ImmobilePceList[index]-PawnDiagonal[j];

                if(ImmobileSq!=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)] && ImmobileSq!=WsideCitadel && ImmobileSq!=BsideCitadel){

                    if(GameBoard.pieces[ImmobileSq]==PIECES.EMPTY) AddQuietMove(MOVE(WsqOfPofP,ImmobileSq,PIECES.EMPTY,PIECES.EMPTY,0));
                    else AddCaptureMove(MOVE(WsqOfPofP,ImmobileSq,GameBoard.pieces[ImmobileSq],PIECES.EMPTY,0));
                }

            }
        }

    }

    else if(bPromNumPofP==1 && RanksBrd[BsqOfPofP]==BpromotionRank &&
        GameBoard.side==COLOURS.BLACK && SqAttacked(BsqOfOnlyKing,GameBoard.side^1)==Bool.False){


        for(index=0;index<112;index++){

            sq=SQ342(index);

            if(PieceColor[GameBoard.pieces[sq]] == COLOURS.WHITE){

                GameBoard.WhitePceList[Windex]=sq;
                Windex++;
            }

        }

        if(Colors[IndexColorOfPlayer]==COLOURS.WHITE) diagonal=14;

        else diagonal=-16;


        for(index=0;index<GameBoard.WhitePceList.length;index++){

            sq=GameBoard.WhitePceList[index];
            sq1=GameBoard.WhitePceList[index+1]-2;
            sq2=GameBoard.WhitePceList[index+2]-2;


            if(sq==sq1 && RanksBrd[sq] == RanksBrd[sq1]) fork_sq=GameBoard.WhitePceList[index+1]+diagonal;
            else if(sq==sq2 && RanksBrd[sq]==RanksBrd[sq2]) fork_sq=GameBoard.WhitePceList[index+2]+diagonal;
            else continue;


             if(RanksBrd[fork_sq]!=SQUARES.OFF_BOARD && GameBoard.pieces[fork_sq]!=GameBoard.WhiteOnlyKingInGame){

                 if (GameBoard.pieces[fork_sq] != PIECES.EMPTY) {


                     AddCaptureMove(MOVE(BsqOfPofP,fork_sq,GameBoard.pieces[fork_sq],PIECES.EMPTY,0));
                 }
                 else {
                     AddQuietMove(MOVE(BsqOfPofP,fork_sq,PIECES.EMPTY,PIECES.EMPTY,0));
                 }

             }
        }


        for(index=GameBoard.moveListStart[GameBoard.ply-1];
            index<GameBoard.moveListStart[GameBoard.ply];index++){

            move=GameBoard.moveList[index];

            if(movingPceList.indexOf(FROMSQ(move))==-1) {

                movingPceList.push(FROMSQ(move));
            }
        }

        console.log("tüm taşlar "+GameBoard.WhitePceList);
        console.log("hareket eden taşlar "+movingPceList);

        PceList=GameBoard.WhitePceList.concat(movingPceList);


        console.log(PceList);


        for(index=0;index<GameBoard.WhitePceList.length;index++){

            piece=PceList[index];
            if(PceList.indexOf(piece)==PceList.lastIndexOf(piece)){

                ImmobilePceList.push(piece)
            }

        }

        console.log(ImmobilePceList);
        var j,ImmobileSq;

        for(index=0;index<ImmobilePceList.length;index++){

            for(j=0;j<PawnDiagonal.length;j++){

                ImmobileSq=ImmobilePceList[index]+PawnDiagonal[j];

                if(ImmobileSq!=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)] && ImmobileSq!=WsideCitadel && ImmobileSq!=BsideCitadel){

                    if(GameBoard.pieces[ImmobileSq]==PIECES.EMPTY) AddQuietMove(MOVE(BsqOfPofP,ImmobileSq,PIECES.EMPTY,PIECES.EMPTY,0));
                    else AddCaptureMove(MOVE(BsqOfPofP,ImmobileSq,GameBoard.pieces[ImmobileSq],PIECES.EMPTY,0));
                }

            }
        }

    }


}
/*Piyonun piyonu, şahın piyonun oyun başlangıcında bulunduğu kareye hamle yapılması gerekiyorsa(MoveToInitPosPawnofKing()==Bool.True);
 ya da rakibin kalesindaki en yüksek rütbeli şah, prens veya sonradan gelen taş ile yer değiştirmesi gerekiyorsa; ya da
 sonradan gelen şah kendi kalesinden çıkmak zorundaysa diğer hamleler yapılamaz. Bu üç durumum olmadığı durumlarda diğer hamleler
 yapılabilir.*/

function  GenerationMoves() {

    var Move2InitPosPofK=MoveToInitPosPawnofKing();
    var escapeKing=SwitchPlaceOfKing();
    var escapeAdKing=AdKingMoveFromCitadel();

    if(Move2InitPosPofK==Bool.False && escapeKing==Bool.False && escapeAdKing==Bool.False){

        PiecesMoveGen();
        SoleKingSwitchPlaceWithAnyPiece();
        ForkingAndImmobile();

    }
}
/*
* Sonradan gelen şah kendi kalesindeyken oyuncunun diğer şahları oyundan alınırsa
* sonradan gelen şah kalesinden çıkmak, piyonun piyonunun oyun başlangıcındaki konumuna
* hamle yapmak zorundadır. AdKingMoveFromCitadel fonksiyonu bu hamlenin değişkenlerini hesaplamaktadır.
* Gerekli açıklamalar sadece beyaz oyuncu için yapılmış, siyah oyuncunun hamlesi benzer oduğu için açıklama gereği
* duyulmamıştır.
*
* */

function AdKingMoveFromCitadel() {

/*
* Beyaz oyuncunun en yüksek rütbeli şahın bulunduğu kare WsqOfKing değişkenine,
* siyah oyuncununinki ise BsqOfKing değişkenine atanır.
*
* */
    var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteHighestRanKING,0)];
    var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackHighestRanKING,0)];
    var new_sq;
    var index;

/*Piyonun piyonunun oyun başlangıcında bulunduğu kare tehdit altındaysa sonradan gelen şah
sonraki tehdit altında olmayan ilk kareye hamle yapar. index değişkeni sonraki tehdit altında olmayan ilk karenin hesaplanması için
kullanılır. Eğer beyaz taşlar ekranda aşağıda dizilimişse(Colors[IndexColorOfPlayer]==COLOURS.WHITE) piyonun piyonununbaşlangıç karesi
2. satır 1. sütundadır, yani yanıdaki kareler sağında dolayısıyla da kare numaraları artmaktadır. Bu yüzden
index değeri 1, yukarıda dizilmişse piyonun piyonunun başlangıç karesi en sağda dolayısıyla diğer kareler solunda ve
kare numaraları daha düşüktür. Bu karelerin hesaplanması için index değeri -1 olarak belirlenir.

*/
    if(Colors[IndexColorOfPlayer]==COLOURS.WHITE) index=1; else index=-1;
/*
* Hamle sırası beyaz oyuncuda, en yüksek rütbeli şah sonradan gelen şah(Bu, oyundaki tek şahın sonradan gelen şah olduğu
* anlamına gelmektedir. Çünkü şahlar arasında en düşük rütbeli olan sonradan gelen şahtır.) ve bu sonradan gelen şahın bulunduğu kare
* kendi kalesi olarak adlandırılan kare ise bu hamlenin yapılması zorunludur.
*
* */
    if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteHighestRanKING==PIECES.WadKing && WsqOfKing==WsideCitadel){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
/*WpOfpInitSq değişkeni piyonun piyonunun oyun başlangıcında bulunduğu karenin numarasını tutmaktadır.
Hamle yapılacak kare numarasını new_sq karesi olduğu için bu kare  new_sq değişkenine atanır.
*
*
* */
        new_sq=WpOfpInitSq;
/*
* Bu kare tehdit altındaysa sonradan gelen şah bu kareye hamle yapamaz, bir yanındaki karenin tehdit altında olup
* olmadığı kontrol edilir. Eğer bu kare de tehdit altındaysa sonraki kare kontrol edilir bu şekilde tehdit altında olmayan
* ilk kareye hamle yapılır. Bu yüzden while döngüsü kullanılmış, new_sq karesi tehdit altındaysa bu değer index değişkeniyle
* arttırılarak sonraki kareler hesapklanıp kontroledilmektedir.
*
*
* */
        while(1){

            if(SqAttacked(new_sq,COLOURS.BLACK)==Bool.False){

                AddQuietMove(MOVE(WsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGMOVEADKINGFROMCITADEL));

                return Bool.True;
            }
/*
* Hesaplana kare tehdit altında olduğu sürece kare numarası arttır/azalt ve hesaplanan güncel new_sq
* karesinin tehdit altında olup olmadığını kontrol et.
* */
            new_sq+=index;
        }
    }else if(GameBoard.side==COLOURS.BLACK && GameBoard.BlackHighestRanKING==PIECES.BadKing && BsqOfKing==BsideCitadel){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

        new_sq=BpOfpInitSq;

        while(1){
            if(SqAttacked(new_sq,COLOURS.BLACK)==Bool.False){

                AddQuietMove(MOVE(BsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGMOVEADKINGFROMCITADEL));

                return Bool.True;
            }
            new_sq-=index;
        }
    }

    return Bool.False;
}


/*Oyuncunun en yüksek rütbeli şahı rakibin kalesine girdiğinde iki seçenek oluşur;
oyuncu oyunu berabere bitirir, oyuncu en yüksek rütbeli şahını diğer şahlarından biriyle yer değişirir.
Bu fonksiyon en yüksek rütbeli şahın diğer şahlardan biriyle yer değiştirme hamlesinin hesaplandığı fonksiyondur.
İki oyuncu için açıklamalar benzer olduğundan sadece beyaz oyuncunun hamlesi için açıklama yapılmıştır.
*/
function SwitchPlaceOfKing() {

/*
* Beyaz oyuncunun en yüksek rütbeli şahın bulunduğu kare WsqOfKing değişkenine,
* siyah oyuncunun en yüksek rütbeli şahı BsqOfKing değişkenine atanır.
* */
    var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteHighestRanKING,0)];
    var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackHighestRanKING,0)];
    var index,new_sq,pce;
/*
* Hamle sırası beyaz oyuncuda, en yüksek rütbeli şahı rakibin kalesinde ve oyundaki şahların sayısıbirden fazla(oyuncunun
* prens ve/veya sonradan gelen şahı oyunda anlamına gelmektedir) ise en yüksek rütbeli şah(asıl şah) diğer şahlardan biriyle yer de
*
* değiştimelidir
* */
    if(GameBoard.side==COLOURS.WHITE && WsqOfKing==BsideCitadel && GameBoard.WhiteKingsInGame.length>1){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
/*
* Beyaz oyuncunun şahları döngüye alınır
* */
        for(index=0;index<GameBoard.WhiteKingsInGame.length;index++){
/*
* Bu şahlar sırasıyla pce değişkenine atanır.
* */
            pce=GameBoard.WhiteKingsInGame[index];
/*
* pce taşı en yüksek rütbeli şah ise döngünün sonraki adımına geçer çünkü kendisiyle değil diğer şahlarla yer değiştirmeli
* */
            if(pce==GameBoard.WhiteHighestRanKING) continue;
/*
* pce değişkeninde saklı olan şahın bulunduğu kare new_sq değişkenine atanır.
* */
            new_sq=GameBoard.pList[PCEINDEX(pce,0)];
//new_sq karesi hamle yapılacak kare olarak hesaplanıp GameBoard.moveList dizisine atanır.
            AddQuietMove(MOVE(WsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGSWITCHKING));

        }
        return Bool.True;//Bu durum gerçekleştiğinde diğer hamlelerin yapılmaması için fonksiyon Bool.True değeri döner.

    }else if(GameBoard.side==COLOURS.BLACK && BsqOfKing==WsideCitadel && GameBoard.BlackKingsInGame.length>1){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
        for(index=0;index<GameBoard.BlackKingsInGame.length;index++){

            pce=GameBoard.BlackKingsInGame[index];
            if(pce==GameBoard.BlackHighestRanKING) continue;

            new_sq=GameBoard.pList[PCEINDEX(pce,0)];
            AddQuietMove(MOVE(BsqOfKing,new_sq,PIECES.EMPTY,PIECES.EMPTY,MFLAGSWITCHKING));
        }
        return Bool.True;
    }
//Eğer bu iki durum da gerçekleşmezse fonksiyon Bool.False değerini dönerek diğer hamlelerin yapılabileceğini bildirir.
    return Bool.False;
}

//Piyonun piyonu üçüncü kez terfi olmak için Şahın piyonun başlangıç konumuna yapılacak hamlenin hesabının
//yapıldığı fonksiyon.
function MoveToInitPosPawnofKing() {

//Beyaz oyuncunun piyonun piyonun bulunduğu kare, Wsq değişkenine atandı.
    var Wsq=GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)];
//Siyah oyuncunun piyonun piyonun bulunduğu kare, Wsq değişkenine atandı.
    var Bsq=GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)];
//Beyaz oyuncunun oyunda olan son şahının bulunduğu kare WsqOfOnlyKing değişkenine atandı.
    var WsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
//Siyah oyuncunun oyunda olan son şahının bulunduğu kare BsqOfOnlyKing değişkenine atandı.
    var BsqOfOnlyKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];

    var Previous_move;
    var Previous_from;
    var sq;
/*
* Oyuncunun piyonun piyonun terfi sayısı 2 , bu piyon terfi olan karelerden birinde, hamle sırası bu oyuncuda ve
* oyuncunun oyundaki tek Şahı tehdit altında değilse bu hamle yapılmak zorundadır.
*
* */

    if(wPromNumPofP==2 && RanksBrd[Wsq]==WpromotionRank &&
        GameBoard.side==COLOURS.WHITE && SqAttacked(WsqOfOnlyKing,GameBoard.side^1)==Bool.False){
//Şuanki olası hamlelerin tutulduğu GameBoard.moveList dizisinin indeks değeri
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];
//Şahın piyonun piyonun başlangıç konumu boş ise
        if(GameBoard.pieces[WinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(Wsq,WinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));
//Şahın piyonun piyonun başlangıç konumunda herhangi bir taş varsa buu taş oyundan alınır. Bu taş GameBoard.pieces[WinitSqPofK]
//şeklinde hesaplanır.
        else AddCaptureMove(MOVE(Wsq,WinitSqPofK,GameBoard.pieces[WinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));
//Diğer hamlelerin yapılmasını önlemek için fonksiyon Bool.True değerini döndürür.
        return Bool.True;


    }
//Beyaz oyuncu için yapılan açıklamanın aynısı siyah oyuncu içinde geçerlidir. Bu yüzden yeniden açıklama yapılmamıştır.
    else if(bPromNumPofP==2 && RanksBrd[Bsq]==BpromotionRank &&
        GameBoard.side==COLOURS.BLACK && SqAttacked(BsqOfOnlyKing,GameBoard.side^1)==Bool.False){
        GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

        if(GameBoard.pieces[BinitSqPofK]==PIECES.EMPTY) AddQuietMove(MOVE(Bsq,BinitSqPofK,0,PIECES.EMPTY,MFLAGTOBEADKING));
        else AddCaptureMove(MOVE(Bsq,BinitSqPofK,GameBoard.pieces[BinitSqPofK],PIECES.EMPTY,MFLAGTOBEADKING));

        return Bool.True;
    }
//İki oyuncu için de böyle bir ihtimal yoksa fonksiyon Bool.False değerini döndürür.
    return Bool.False;
}

/*Özel durumlar hariç olası tüm hamleleri GameBoard.moveList dizisinde listeleneceği fonksiyon.*/
function PiecesMoveGen() {

    var PieceIndex;
    var Pce;
    var new_sq;
    var Direction;
    var sq;
    var PieceNumber;
    var index;
    var j;
/*
* GameBoard.moveListStart[GameBoard.ply + 1] değişkeni, olası hamlelerin listeleneceği GameBoard.moveList dizisinin indeksidir.
* GameBoard.ply değişkeni, oynanan hamle sayısını tutmaktadır.Bu değişken tanımlı olmadığı için
* GameBoard.moveListStart[GameBoard.ply] değişkeni atanmıştır.
* **/
    GameBoard.moveListStart[GameBoard.ply + 1] = GameBoard.moveListStart[GameBoard.ply];

    if(GameBoard.side==COLOURS.WHITE){//Oyun sırası beyaz oyuncuda ise
/*
*Beyaz piyonların hamle yapabilecekleri karelerin hesaplanması.
* Beyaz piyonlar döngüye alınıp bulundukları kare numarası, ardından hamle yapabilecekleri kare numaraları hesaplanır. */
        for(index=0;index<WhitePawns.length;index++){
//Piyonların numarasının tutulduğu GameBoard.piecesNUMBER dizisi döngüye alınıp her piyonun numarası elde edilir.
            for(PieceNumber=0;PieceNumber<GameBoard.piecesNUMBER[WhitePawns[index]];++PieceNumber){
//WhitePawns[index] piyonu, PieceNumber ise bu piyonun numarasını tutmaktadır. GameBoard.pList dizisinden bulunduğu kare numarası
//sq değişkenine atanır.
                sq = GameBoard.pList[PCEINDEX(WhitePawns[index], PieceNumber)];
/*
* PawnsFowards değişkeni, beyaz piyonların hamle yapacakları kare ile bulunduları kare arasındaki farkı tuttuğundan
* bu değer sq karesine eklendiğinde beyaz piyonların hamle yapabilecekleri kare numarası hesaplanır.
* */
                if (PawnAttackedSqStraight(sq+PawnsFowards,COLOURS.WHITE) == Bool.True ) {
//Bu fonksiyonla AddQuietMove fonksiyonu çalıştırılarak hamlenin tüm değişkenlerinin tutulduğu sayı
//GameBoard.moveList dizisine atanır.
                    AddPawnQuietMove(sq,sq+PawnsFowards);
                }

/*
*PawnDiagonal dizisi, beyaz piyonların hamle yapabilecekleri çapraz kareler ile bulundukları kare arasındaki fark değerlerini tutmakatdır.
* Bu yüzden bu değerler sq(beyaz piyonların bulundukları kare) değerine eklenince piyonların hamle yapabilecekleri karelerin numarası hesaplanır. */
                for(j=0;j<PawnDiagonal.length;j++){

                    if (PawnAttackedSqDiagonalWhite(sq+PawnDiagonal[j]) == Bool.True ) {
/*Bu fonksiyonla AddCaptureMove fonksiyonu çalıştırılarak hamlenin tüm değişkenlerinin tutulduğu sayı
GameBoard.moveList dizisine atanır.
*/
                        AddPawnCaptureMove(sq,sq+PawnDiagonal[j],GameBoard.pieces[sq + PawnDiagonal[j]]);
                    }
                }
            }
        }
    }
/*Siyah piyonların hamle yapabilecekleri karelerin hesaplanmasının sadece beyaz
 piyonlarınkinden farklı olduğu kısımlar açıklanmıştır.
 */

    else{//Hamle sırası siyah oyuncuda ise

        for(index=0;index<BlackPawns.length;index++){

            for(PieceNumber=0;PieceNumber<GameBoard.piecesNUMBER[BlackPawns[index]];++PieceNumber){
                sq = GameBoard.pList[PCEINDEX(BlackPawns[index], PieceNumber)];
//PawnsFowards değişkeni; siyah oyuncunun piyonlarının bulunduğu kare ile hamle yapacakları kare arasındaki fark değerin tuttuğu için bu değer
//siyah piyonların bulunduğu kareden çıkarılarak siyah piyonların hamle yapabileceği karelerin numarası hesaplanır.
                if (PawnAttackedSqStraight(sq-PawnsFowards,COLOURS.BLACK) == Bool.True) {

                    AddPawnQuietMove(sq,sq-PawnsFowards);
                }
/*
PawnDiagonal dizisi, siyah piyonların bulundukları kare ile hamle yapabilecekleri çapraz kareler  arasındaki fark değerlerini tutmaktadır.
* Bu yüzden bu değerler sq(siyah piyonların bulundukları kare) değerinden çıkarılınca piyonların hamle yapabilecekleri karelerin numarası hesaplanır.
*/
                for(j=0;j<PawnDiagonal.length;j++){

                    if (PawnAttackedSqDiagonalBlack(sq-PawnDiagonal[j]) == Bool.True) {

                        AddPawnCaptureMove(sq,sq-PawnDiagonal[j],GameBoard.pieces[sq-PawnDiagonal[j]]);
                    }
                }
            }
        }
    }

/*Hamle yapabilecekeleri yön sayısı ile hamle sayısı aynı olan taşların hamle yapacakları
karelerin hesaplanması ve GameBoard.moveList dizisine atanması.
Hamle sırası beyazın ise PieceIndex değişkeni 0, siyahın ise 1 olmaktadır.
*/

    PieceIndex = LoopNonSlideIndex[GameBoard.side];
/*Böylece PieceIndex değişkeni ile LoopNonSlidePieces dizisindeki taşların rengi belirlenmektedir.
Eğer PieceIndex değişkeni 0 ise LoopNonSlidePieces dizisinin 0. indeksinden başlayarak tüm beyaz taşların olası hamleleri
hesaplanacak daha sonra Pce değişkeni LoopNonSlidePieces dizisinde siyah ve beyaz taşları birbirinden ayırmak için
eklenen 0 değerine eşit olunca döngüden çıkılacaktır. Eğer Hyamle sırası siyahın ise PieceIndex değişkeni 1 olur,
böylece LoopNonSlidePieces dizisinin 7. İndeks değerinden başlayarak tüm siyah taşların olası hamleleri hesapladıktan sonra
Pce değişkeni LoopNonSlidePieces dizisinin son elemanı olan 0 değişkenine eşit olunca döngüden çıkılacaktır.*/
    Pce = LoopNonSlidePieces[PieceIndex];
/*LoopNonSlidePieces dizisinde beyaz ve siyah taşlar arasına ve dizinin sonuna sııfır değeri eklenmişti.
Bu sıfır değeri sadece hamle sırası olan oyuncunun taşlarının olası hamleleri GameBoard.moveList dizisine atanması için gerekli görülmüştü.*/
    while (Pce != 0) {
//Oyunda bulunan Pce taşı kadar for döngüsü çalıştırılır.
        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
/*Oyundaki aynı taşın birden fazla olduğu durumlarda bulundukları karelerin numaraları karışmaması için
aynı taşların farklı numaralarını tutan GameBoard.piecesNUMBER dizisi ile taşın hangi numaraya sahip olduğu tutulmaktadır.
Böylece taş ve numarasıyla PCEINDEX fonksiyonu aracılığıyla GameBoard.pList dizisindeki kare numarası sq değişkenine atanımştır.
Bu sq değeri pce değişkenin bulunduğu karedir.*/
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];
/*Bu pce değişkeninin hamle yapabileceği kareleri hesaplamak için
taşın hamle yapabileceği kareler ile bulundukları kare arasındaki fark değerlerini tutan diziye,
dolayısıyla bu fark değerlerini tutan dizilerin tanımlı olduğu PieceDirection dizisine
ve taşların hamle yapabilecekleri yönlerin sayısını tutan DirectionNumber dizisine ihtiyaç duyulmaktadır.
DirectionNumber[Pce] değeri ile pce taşının hamle yapabileceği kareler ile taşın bulunduğu kare arasındaki fark değerlerinin tutan dizi elde edilir.
*/
            for (index = 0; index < DirectionNumber[Pce]; index++) {
/*Fark değerlerini tutan dizinin elemanları sırasıyla elde edilir. */
                Direction = PieceDirection[Pce][index];
/*Elde edilen bu değerler Pce taşının bulunduğu kareye eklendiğinde hamle yapabileceği kareler hesaplanmış olur.*/
                new_sq = sq + Direction;
/*Bu kare 10*11 tahtanın dışında ya da KALE’lerden biri ise taş bu kareye hamle yapamaz dolayısıyla döngünün başına dönülür. */
                if (SQOFFBOARD(new_sq) == Bool.True || new_sq==WopponetCitadel || new_sq==WsideCitadel) {

                    continue;
                }
/*Pce taşının hamle yapabileceği new_sq karesi boş değilse yani bu karede taş varsa  */
                if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
/*Bu taş hamle sırası olan tarafın taşı değilse pce taşı bu kareye hamle yapabilir.*/
                    if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {
/*Hamlenin tüm değişkenlerinin tutulduğu sayı MOVE fonsiyonu ile oluşturulur.
Daha sonra bu sayı AddCaptureMove fonksiyonu aracılığıyla GameBoard.moveList dizisine atanır.*/
                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }
                } else {
/*Oyundan alınan taş olmadığı için captured değişkenine PIECES.EMPTY değeri atanır.
Bu sayı yine MOVE fonksiyonu aracılığıyla üretilir, ancak bu defa AddQuietMove fonksiyonu aracılığıyla GameBoard.moveList dizine atanır.
*/
                    AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                }
            }
        }
/*Diğer taşların hareket hamle yapabilecekleri karelerin hesaplanıp GameBoard.moveList dizisine atanması için
LoopNonSlidePieces dizisindeki sonraki taş pce değişkenine atanmıştır.
Böylece hamle sırası olan oyuncunun kaymayan tüm taşlarının olası hamleleri GameBoard.moveList dizisine atanır.*/
        Pce = LoopNonSlidePieces[PieceIndex++];
    }
/*Kale taşının olası hamlelerin hesaplanması ve GameBoard.moveList dizisine atanması.
Kalelerin hamle yapabilecekleri karelerin hesaplanması ve GameBoard.moveList dizisine atanması,
sadece yukarıdaki açıklamadan yer almayan While döngüsü ile ayrılmaktadır.
Bu yüzden sadece While döngüsünün çalışma prensibi açıklanmıştır.
While döngüsü kale hareket edeceği bir yönde birden fazla kareye hamle yapabileceğinden dolayı kullanılmıştır.
*/
    PieceIndex = LoopSlideRookIndex[GameBoard.side];
    Pce = LoopSlideRook[PieceIndex];

    while (Pce != 0) {
        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;
/*Hamlenin yapılıp yapılamayacağı kontrol edilen new_sq karesi
10*11 tahtanın sınırları içerisinde olduğu sürece While döngüsünü çalıştır.*/
                while (SQOFFBOARD(new_sq) == Bool.False) {

                    if(new_sq==WopponetCitadel || new_sq==WsideCitadel){

                        new_sq += Direction;
                        continue;
                    }

                    if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                        if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                            AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                        }
//new_sq karesinde taş varsa while döngüsünden çık.
                        break;
                    }

                    AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
/*While döngüsünün sonraki adımında new_sq karesine,
karenin şuanki yönde hamle yapabileceği diğer karelerin hesaplanması için
şuandaki yönün fark değerini tutan Direction değişkenini eklenir.*/
                    new_sq += Direction;
                }
            }
        }
        Pce = LoopSlideRook[PieceIndex++];
    }
/*
Mancınığın hamle yapabileceği karelerin hesabı Kaleninkilerine benzer olduğundan dolayı açıklama yapılamaya gerek duyulmamıştır.
Sadece içteki ikinci while döngüsünde generalin fark değerlerini tutan Minister_direction dizisinin elemanları yeni kareye –new_sq- eklenir.
Bunun nedeni Mancınık çapraz yönde en az iki kare ilerlemesidir. Mancınığın her yönde hamle yapabileceği ilk kare,
mancınığın çaprazında iki kare ilerideki kareyi hesaplayacak fark değerlerini tutan Catapult_direction dizisinin elemanlarıyla hesaplanırken;
o yöndeki olası diğer hamlelerin hesabı,
hesaplanan bu karenin çaprazındaki karelerin numarasının hesabı Minister_direction dizisinin elemanlarıyla yapılır. */
    PieceIndex = LoopSlideCatapultIndex[GameBoard.side];
    Pce = LoopSlideCatapult[PieceIndex];

    while (Pce != 0) {
        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;

                if(GameBoard.pieces[sq+Minister_direction[index]]==PIECES.EMPTY){

                    while (SQOFFBOARD(new_sq) == Bool.False) {

                        if(new_sq==WopponetCitadel || new_sq==WsideCitadel){

                            new_sq += Minister_direction[index];
                            continue;
                        }

                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {

                            if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                            }
                            break;
                        }

                        AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));

                        new_sq += Minister_direction[index];
                    }
                }
            }
        }
        Pce = LoopSlideCatapult[PieceIndex++];
    }
// Zürafanın hareketinin sadece kalenin hareketinden farklı olan kısımlar açıklanmıştır.
    PieceIndex = LoopSlideGiraffeIndex[GameBoard.side];
    Pce = LoopSlideGiraffe[PieceIndex];

    while(Pce !=0){

        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for(index=0;index<DirectionNumber[Pce];index++){

                Direction = PieceDirection[Pce][index];
                new_sq = sq + Direction;
/*Zürafanın hareket edebilmesi için boş olması gereken üç kareden ilki çaprazı:sq+Giraffe3_direction[index],
ikincisi zürafanın bulunduğu konuma göre o yönde atın hamle yapabileceği kare: sq+Knight_direction[index],
üçüncüsü zürafanın bulunduğu konuma göre o yönde devenin hamle yapabileceği kare: sq+Camel_direction[index]’dir. */

                if(GameBoard.pieces[sq+Giraffe3_direction[index]]==PIECES.EMPTY && GameBoard.pieces[sq+Knight_direction[index]]==PIECES.EMPTY &&
                    GameBoard.pieces[sq+Camel_direction[index]]==PIECES.EMPTY ){

                    while (SQOFFBOARD(new_sq) == Bool.False) {

                        if(new_sq==WsideCitadel || new_sq==WopponetCitadel){

                            new_sq += Giraffe2_direction[index];
                            continue;
                        }


                        if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                            if (PieceColor[GameBoard.pieces[new_sq]] != GameBoard.side) {

                                AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));
                            }
                            break;
                        }

                        AddQuietMove( MOVE(sq, new_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
/*new_sq karesinde taş yoksa sonraki kareler zürafanın hareket ettiği yöne göre
bu karenin aşağısında, yukarısında, sağında ya da solundadır.
Bu karelerin hesaplanması Giraffe2_direction dizisinin elemanlarıyla olmaktadır. */

                        new_sq += Giraffe2_direction[index];
                    }
                }
            }
        }
        Pce = LoopSlideGiraffe[PieceIndex++];
    }
/*Şahların(Şah,prens ve sonradan gelen şah) hamle yapabilecekleri karelerin hesaplanması;
 hareket ettikleri yön sayısı hamle sayısına eşit olan deve, at, debbabe, general, vezir
 gibi taşların hareketlerine benzer şekilde kondlanmıştır.
 Sadece farklılıklar açıklanacaktır.  */
    PieceIndex = LoopKingsIndex[GameBoard.side];
    Pce = LoopKings[PieceIndex];

    while (Pce != 0) {

        for (PieceNumber = 0; PieceNumber < GameBoard.piecesNUMBER[Pce]; ++PieceNumber) {
            sq = GameBoard.pList[PCEINDEX(Pce, PieceNumber)];

            for (index = 0; index < DirectionNumber[Pce]; index++) {
                Direction = PieceDirection[Pce][index];

                new_sq = sq + Direction;

                if (SQOFFBOARD(new_sq) == Bool.True) {

                    continue;
                }

                if (GameBoard.pieces[new_sq] != PIECES.EMPTY) {
                    if(PieceColor[Pce]== COLOURS.WHITE && PieceColor[GameBoard.pieces[new_sq]] == COLOURS.BLACK){
//Hesaplanan new_sq karesi kale olarak adlandırılan karelerden biri ise Pce taşı bu kareye hamle yapamaz.
//Dolayısıyla döngünün sonraki adımına geçilir.

                        if( new_sq==WsideCitadel || new_sq==BsideCitadel ){

                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }else if(PieceColor[Pce]== COLOURS.BLACK && PieceColor[GameBoard.pieces[new_sq]] == COLOURS.WHITE){
//Yukarıda beyaz oyuuncu için yapılan açıklamanın aynısı geçerlidir.

                        if(new_sq==BsideCitadel  ||new_sq==WsideCitadel){

                            continue;
                        }

                        AddCaptureMove(MOVE(sq,new_sq,GameBoard.pieces[new_sq],PIECES.EMPTY,0));

                    }
                }
                else {
                    if(PieceColor[Pce]== COLOURS.WHITE){

/*Hesaplanan new_sq karesi oyuncunun kendi Kalesi olarak adlandırılan kare ise ve bu taş
 sonradan gelen şah değilse döngünün sonraki adımına geçilir.
 Çünkü oyuncunun kendi kalesine sadece sonradan gelen şah hamle yapabilir. Dolayısıyla bu kareye hamle yapılamaz.
 Ya da new_sq karesi rakibin Kalesi ise ve Pce taşı oyundaki en yüksek rütbeli şah değilse bu kareye hamle yapılamaz,
 çünkü rakibin kalesine sadece en yüksek rütbeli şah hamle yapabilir.
 Dolayısıyla döngünün sonraki adımına geçilerek şahın diğer yönlerdeki kareler hesaplanıp hamle yapılıp yapılamayacağı kontrol edilir.*/
                        if( (new_sq==WsideCitadel  && Pce!=PIECES.WadKing) ||
                            (new_sq==BsideCitadel && Pce!=GameBoard.WhiteHighestRanKING)){

                            continue;
                        }

                        AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                    }else if(PieceColor[Pce]== COLOURS.BLACK){
//Yukarıda beyaz oyuncu için yapılan açıklama siyah oyuncu için de aynı açıklama geçerli olduğundan
//yeniden açıklama yapılmamıştır.

                        if( (new_sq==BsideCitadel && Pce!=PIECES.BadKing) ||
                            (new_sq==WsideCitadel && Pce!=GameBoard.BlackHighestRanKING) ){

                            continue;
                        }
                        AddQuietMove(MOVE(sq,new_sq,PIECES.EMPTY,PIECES.EMPTY,0));

                    }
                }
            }
        }
        Pce = LoopKings[PieceIndex++];

    }

}

