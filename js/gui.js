/*

$("#setFen").click(function () {

    var FenString=$("#set").val();
    console.log("FenString "+FenString);
    NewGame(FenString);

});
*/
/*NewGame fonksiyonu, hazır pozisyonları tahtada görüntülemek ve oyuna buradan devam etmeyi sağlar. */
function NewGame(FenString) {
/*FenString değişkeninde saklı olan karekter dizisi ParseFen fonksiyonuna gönderilerek taşların bulundukları kare GameBoard.pieces
* dizisine eklenir. PrintBoard fonksiyonuyla tahtada olan taşların dizilimi konsolda ekrana yazdırılır, SetInitialBoardPieces fonksiyonuyla
* tüm taşlar grafiksel arayüze eklenir, CheckandSet fonksiyonuyla ise oyunun bitip bitmediği kontrol edilir.
 * */
    ParseFen(FenString);
    PrintBoard();
    SetInitialBoardPieces();
    CheckandSet();

}

/*ClearAllPieces fonsiyonu oyun başlamadan önce tahtadaki tüm taşları temsil eden resimleri siler.*/
function ClearAllPieces() {

    $(".Piece").remove();

}

/*SetInitialBoardPieces fonksiyonu, taşları temsil eden resimleri grafiksel arayüze ekler.*/
function SetInitialBoardPieces() {

    var sq ;
    var sq270;

    var piece;
/*Tahtadaki tüm taşları temizlenir.*/
    ClearAllPieces();
/*Karelerin numarası SQ342 fonksiyonuyla hesaplanır.*/
    for(sq=0;sq<112;sq++){

        sq270=SQ342(sq);
/*Hesaplana karediki taş piece değişkenine atanır.*/
        piece=GameBoard.pieces[sq270];
/*piece değişkeni PIECES nesnesinde tanımlanan taşlardan biri ise bu taşı temsil eden resim AddGuiPiece
* fonksiyonuyla grafiksel arayüze eklenir.*/
        if(piece >=PIECES.WpOfPawn && piece<=PIECES.BadKing){

            AddGuiPiece(sq270,piece);
        }
    }
}

/*DeSelected fonksiyonu, tıklanıp renklenen kareleri ve bu karede bulunan taşın hamle yapacağı karelerdeki renk değişimini siler. */
function DeSelected(sq) {
    $(".Square").each(function () {

        $(this).removeClass("SqAttacked");

        if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True){

            $(this).removeClass("SqSelected");
        }
    });
}

/*SetSelected fonksiyonu, tıklanan taşın bulunduğu kareyi renklendirir.*/
function SetSelected(sq) {

    $(".Square").each(function () {
/*Eğer tıklanan nokta bir kare ve tıklanan karedeki taş hamle sırası olan oyuncunun taşı ise bu kare SqSelected
* Css ifadesinin özellikleriyle renklenir.*/
        if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True && PieceColor[GameBoard.pieces[sq]] == GameBoard.side){

            $(this).addClass("SqSelected");
        }
    });
}

/*ClickedSquare fonksiyonu, tıklanan noktanın koordinatlarıyla karenin
 * satır ve sütun numarası hesaplanır, ardından satır ve sütun numaralarıyla karenin numarası hesaplanır.*/
function  ClickedSquare(pageX,pageY) {
/*Tahtanın başlangıç konumu position değişkenine atanır.*/
    var position =$("#board").position();
//Tahtaya ekranda soldan verilen boşluk workedX, yukarıdan verilen boşluk ise workedY değişkenine atanır.
    var workedX=Math.floor(position.left);
    var workedY=Math.floor(position.top);
/*Tıklanan noktanın x ve y koordinataları tam sayıya dönüştürülür.*/
    pageX=Math.floor(pageX);
    pageY=Math.floor(pageY);
/*Tıklanan noktanın x koordinatından(pageX) tahtaya ekranda verilen soldan boşluk(workedX) çıklarılıp 60'a
* bölündüğünde tıklanan noktanın sütun numarası hesaplanır, file değişkenine atanır.*/
    var file=Math.floor((pageX-workedX)/60);
/*Aynı hesaplama tıklanan noktanın satır numarası için yapılır. Ancak farklı olarak hesaplanan bu değer 10'dan çıkarılarak
* satır numarası hesaplanır. Bunun nedeni ekranda yukarıya çıkıldıkça yukarıdan verilen boşluğun azalması ama satır numarsının
* artmasıdır.*/
    var rank=10-Math.floor((pageY-workedY)/60);
//Hesaplan satır ve sütun numarası FR2SQ fonksiyonuna girdi olarak gönderilerek tıklanan karenin numarası hesaplanır.
    var sq=FR2SQ(file,rank);
/*Tıklanan kare renklendirilir.*/
    SetSelected(sq);
//Fonksiyon tıklanan kareyi döndürür.
    return sq;
}

$(document).on("click",".Piece", function (e) {
/*From değişkeni henüz hesaplanmadığı için 10*11 tahtanın karelerinden biri değilse */
    if(UserMove.from==SQUARES.NO_SQ){
/*Tıklanan noktanın koordinatlarıyla tıklanan karenin numarası hesaplanır.*/
        UserMove.from= ClickedSquare(e.pageX,e.pageY);

    }else{
/*Eğer UserMove.from değişkeni tahtanın dışındaki numaraya sahip değilse daha önceden hesaplanmış demektir. Tıklanan
* taşın bulunduğu kareye hamle yapılacaktır. Dolaysıyla tıklanan noktanın koordinatlarından kare numarası hesaplanıp hamle yapılacak kare
* numarasını tutan UserMove.to atanır. */
        UserMove.to= ClickedSquare(e.pageX,e.pageY);
    }
/*Hamlenin yapılması için MakeUserMove fonksiyonu çalıştırılır.*/
    MakeUserMove();
/*Tıklanan taşın hamle yapabileceği kareler ShowSquaresPieceCanMove fonksiyonuyla renklendirilir.*/
    ShowSquaresPieceCanMove(UserMove.from,GameBoard.pieces[UserMove.from]);

});

/*Tıklanan taşın hamle yapacağı kareye tıklanması durumunda*/
$(document).on("click",".Square", function (e) {
/*Eğer hamle yapacak taşın bulunduğu kare hesaplanmış ve 10*11 tahtanın karelerinden biriyse(daha önceden taşa tıklanmışsa)
* Tıklanan noktanın koordinatlarından karenin numarası hesaplanır, UserMove.to değişkenine atanır ve MakeUserMove
* fonksiyonuyla hamle tamamlanır.*/
    if(UserMove.from !=SQUARES.NO_SQ){

        UserMove.to= ClickedSquare(e.pageX,e.pageY);
        MakeUserMove();

    }
});

function ShowLastMove(from,to) {

    var from_to=[from,to];

    $(".Square").each(function(){

        for(var index=0;index<from_to.length;index++){

            if(PieceIsOnSq(from_to[index],$(this).position().top,$(this).position().left)==Bool.True){


                $(this).addClass("From2to");
            }

        }

    });
}

/*MakeUserMove fonksiyonu, hamlenin tamamıyla yapıldığı fonksiyondur.*/
function MakeUserMove() {
/*Eğer tıklanan taşın bulunduğu kare ve hamle yapacağı kareler tahtanın dışında değilse*/
    if(UserMove.from !=SQUARES.NO_SQ && UserMove.to !=SQUARES.NO_SQ ){
/*Tıklanan taşın olası hamlelerin saklı olduğu GameBoard.moveList dizisinde yapabileceği hamle olması durumunda bu hamlenin tüm değişkenlerini
* tutan değer parsed değişkenine atanır.*/
        var parsed=ParseMove(UserMove.from,UserMove.to);
/*Tıklanan karedeki taş piece değişkenine atanır.*/
        var piece=GameBoard.pieces[UserMove.from];
        console.log("piece "+piece);

        console.log("user move "+ PrSq(UserMove.from)+ PrSq(UserMove.to));
/*Eğer bu hamle yapılabilir ise( hamlenin tüm değişkenlerini tutan değer  değilse)*/
        if(parsed !=NOMOVE){
/*Hamlenin yapılması için tüm fonksiyonlar çalıştırılır.*/
            MakeMove(parsed);
            PrintBoard();
            MoveGuiPiece(parsed,piece);
            CheckandSet();

        }
        console.log("beyaz at numarası: "+GameBoard.piecesNUMBER[PIECES.Wknight]);

/*Hamle yapıldıktan sonra tıklanıp renklendirilen karelerden renkler silinir.*/
        DeSelected(UserMove.from);
        DeSelected(UserMove.to);
/*Sonraki hamlenin yapılabilir olduğunu kontrol etmek için tıklanan bu karenin numarsı ile hamle yapılan kare numaralarına
10*11 tahtasının dışındaki değerler atanır.*/
        UserMove.from=SQUARES.NO_SQ;
        UserMove.to =SQUARES.NO_SQ;

    }
}


/*RemoveGuiPiece fonksiyonu, hale yapan ytaşın buluduğu kareden ve hamle yapılacak kareden taşları temsil eden resimleri siler.*/
function RemoveGuiPiece(sq) {

    $(".Piece").each(function () {

        if(PieceIsOnSq(sq,$(this).position().top,$(this).position().left)==Bool.True){

            $(this).remove();
        }
    });
}
/*AddGuiPiece fonksiyonu, karelere taşlerı temsil eden resimleri yükler.*/
function AddGuiPiece(sq,pce) {
/*Karenin satır ve sütun numarası hesaplanır*/
    var file=FilesBrd[sq];
    var rank=RanksBrd[sq];
/*Taşı temsil eden resmin kareye yüklenmesi için karenin ekrandaki konumununa ihtiyaç duyulur.
* Karelerin satır ve sütun numaralarının konumları Css dosyasında tanımlandı. Css dosyasında tanımlı olan
* satır numaraları, rank+satır numarası; sütun numaraları ise file+sütun numarası şeklide isimlendirildi.
* Dolayısıyla resmin yükleeceği satır ve sütun numarasının hesaplanması aşağıdaki gibi aynı şekilde olur.*/
    var rankName="rank"+ rank;
    var fileName="file"+ file;
/*Hangi resmin yükleneceğini belirlemek için SideChar[PieceColor[pce]] değişkeniyle yüklenecek resmin rengi,
* PceChar[pce].toUpperCase() değişkeniyle yüklenecek resmin karşılık geldiği taşı ve .png ile resmin uzantısıyle
* birlikte yüklenecek resmin adı belirlenir ve pieceFileName değişkenine atanır.
* pieceFileName değişkenine atanır */
    var pieceFileName="images/" + SideChar[PieceColor[pce]] + PceChar[pce].toUpperCase() + ".png";
/*Resmin ismi, Css dosyasında tanımlı olan satır ve sütun numaraları değişkenleriyle image etiketinde isimlendirilerek tahtaya yüklenir. */
    var imageString="<image   src=\"" +pieceFileName +"\" class=\"Piece " +rankName + " " + fileName + "\"/>";
    $("#board").append(imageString);
}

/*MoveGuiPiece fonksiyonu, tıklanan taşı temsil eden resmi bulunduğu kareden silip tıklanan kareye yükler.*/
function MoveGuiPiece(move,piece) {
/*move değişkeninden hamleyi yapacak taşın bulunduğu kare ve hamle yapacağı kare numaraları hesaplanır.*/
    var from=FROMSQ(move);
    var to=TOSQ(move);

/*move değişkeninden oyundan alınan taşın numarsı hesaplanır, eğer oyundan alınan bir taş varsa(hesaplanan değer 0 değilse)*/
    if(CAPTURED(move)){
/*Hamlenin yapılacağı kareden taşı temsil eden resim silinir.*/
        RemoveGuiPiece(to);

    }

/*Hamlenin yapılacağı karenin satır ve sütun numarası hesaplanır.*/
    var file=FilesBrd[to];
    var rank=RanksBrd[to];
/*Bu satır ve sütun numaraların grafiksel arayüzdeki konumunun hesaplanması için Css dosyasında  tanımlı olan
* Css ifadelerin isimleri hesaplanır.*/
    var rankName="rank"+ rank;
    var fileName="file"+ file;
/*Css ifadesinde tanımlı olan satır ve sütun isimleriyle taşın kareye eklenmsi için yeni bir Class oluşturulur.*/
    $(".Piece").each(function () {

        if(PieceIsOnSq(from,$(this).position().top,$(this).position().left)==Bool.True){

            $(this).removeClass();
            $(this).addClass("Piece "+rankName+" "+fileName);

        }
    });
/*Eğer hamle yapılan kare rakibin kalesi ise bu oyuncunun rakibin kalesine girme sayacı MoveOpponetsCitadel
 * fonksiyonuyla artırılır. */
    MoveOpponetsCitadel(to);

    console.log("move: "+move);
/*Eğer terfi eden bir taş varsa*/
    if( (PROM(move)) ==1 ){
/*Terfi edildiği taşın numarası hesaplanır ve PromPce değişkenine atanır.*/
        var PromPce=Promoted(piece);
/*Eğer PromPce taşı oyuncunun piyonunun piyonu ise piyonun piyonun terfi sayısı tutan değişken artılırılır.*/
        if(PromPce==PIECES.WpOfPawn){

            wPromNumPofP++;

        }
        else if(PromPce==PIECES.BpOfPawn){

            bPromNumPofP++;
        }
/*Hamle yapılan karedeki terfi eden taş silinir, terfi edildiği taş grafiksel arayüze eklenir.*/
        RemoveGuiPiece(to);
        AddGuiPiece(to,PromPce);


    }
/*Eğer oyuncunun en yüksek rütbeli şah, diğer şahlardan biriyle(prens veya sonradan gelen şah) yer değiştirmesi gerekiyorsa
* ya da tehdit altındayken herhangi bir taş ile yer değiştirmesi gerekiyorsa*/
    else if( (move & MFLAGSWITCHKING)!=0 || (move & MFLAGSWITCHANYPIECE)!=0){

/*Hamle yapılacak karedeki taş pieceInto, hamle yapacak olan şah pieceInfrom değişkenine atanır.*/
        var pieceInto=GameBoard.pieces[to];
        var pieceInfrom=GameBoard.pieces[from];
/*Hamle yapılacak karedeki taşı ve hamle yapacak olan şahı temsil eden resimler bulundukları karelerden silinirler.*/
        RemoveGuiPiece(from);
        RemoveGuiPiece(to);
/*Hamle yapacak olan şahın bulunduğu kareye şahın yer değiştirdiği taşı, hamle yapılan kareye şahı temsil eden resimler yüklenir.*/
        AddGuiPiece(from,pieceInfrom);
        AddGuiPiece(to,pieceInto);

/*Eğer oyuncuların oyundaki son şahları tehdit altındayken herhangi bir taş ile yer değiştirdiyse yer değiştimelerini kotrol eden
*değişkenler arttırılır. Böylece bir daha tehdit altındayken hiçbir taş ile yer değiştiremezler. */
        if((move & MFLAGSWITCHANYPIECE)!=0){

            console.log("şah herhangi bir taş ile yer değişti");
            if(PieceColor[pieceInto]==COLOURS.WHITE) WsoleKingSwitchPlacePiece++;
            else if(PieceColor[pieceInto]==COLOURS.BLACK) BsoleKingSwitchPlacePiece++;
        }
    }
}

/*MoveOpponetsCitadel fonksiyonu, oyuncuların en yüksek rütbeli şahları rakibin kalesine girdiklerinde sayaçlarını arttırır. */
function MoveOpponetsCitadel(to){
/*Eğer beyaz taşlar ekranda aşağıda dizilmişse*/
    if(Colors[IndexColorOfPlayer]==COLOURS.WHITE){
/*Hamle yapılan karenin numarası 181 ve bu karede beyaz oyuncunun en yüksek rütbeli şahı varsa
* beyaz oyuncunun sayacını arttır. Bu karenin numarası 88 ve bu kareye hamle yapan taş siyah oyuncunun en yüksek
* rütbeli şahı ise siyah oyuncunun sayacı artırılır.*/
        if(to==181 && GameBoard.pieces[to]==GameBoard.WhiteHighestRanKING) GameBoard.WhiteCounter++;
        else if(to==88 && GameBoard.pieces[to]==GameBoard.BlackHighestRanKING) GameBoard.BlackCounter++;
    }
/*Eğer beyaz taşlar ekranda yukarıda dizilmişse beyaz oyuncunun kalesi 181 siyahınki ise 88 olur.*/
    else if(Colors[IndexColorOfPlayer]==COLOURS.BLACK){

        if(to==88 && GameBoard.pieces[to]==GameBoard.WhiteHighestRanKING) GameBoard.WhiteCounter++;

        else if(to==181 && GameBoard.pieces[to]==GameBoard.BlackHighestRanKING) GameBoard.BlackCounter++;
    }
}

/*DeclareDraw fonksiyonu, oyunun berabere bitip bitmediğini kontrol eder.*/
function DeclareDraw() {

/*Eğer oyuncuları en yüksek rütbeli şahları rakip kalesine bir kez girmiş ve oyunda sadece bir şahları varsa
 fonksiyon oyunun berabere bittiğini bildirmek için Bool.True değerini döndürür.*/
    if( (GameBoard.WhiteCounter==1 && GameBoard.WhiteKingsInGame.length==1) ||
        (GameBoard.BlackCounter==1 && GameBoard.BlackKingsInGame.length==1) ){

        return Bool.True;
    }
/*Eğer oyuncunun şahı rakibin kalesine hamle yapmışsa, oyunda diğer şahlarından en az biri varsa(prens ve/veya sonradan gelen şah)
* ve decDraw değişkeni 0 ise oyuncuya iki seçenek sunulur: Oyunu berabere bitirmek ya da enyüksek rütbeli şahı diğer şahlardan biriyle
* yer değiştirerek oyuna devam etmek.*/
    else if(GameBoard.WhiteCounter==1 && (GameBoard.WhiteKingsInGame.length>1)&& decDraw==0 ){

        decDraw=parseInt(prompt("oyunu berabere bitirmek için 1 oyuna devam etmek için 2 giriniz"));

        if(decDraw==2){

            //şah, prens ya da sonradan gelen şah ile yer değiştirecek

            return Bool.False;
        }
        else if(decDraw==1){

            return Bool.True;
        }
    }
    else if(GameBoard.BlackCounter==1 && (GameBoard.BlackKingsInGame.length>1) && decDraw==0){

        decDraw=parseInt(prompt("oyunu berabere bitirmek için 1 oyuna devam etmek için 2 giriniz"));

        if(decDraw==2){

            //şah, prens ya da sonradan gelen şah ile yer değiştirecek

            return Bool.False;
        }
        else if(decDraw==1){

            return Bool.True;
        }
    }

/*Eğer oyuncunun en yüksek rütbeli şahı ilk kez rakibin kalesine hale yapınca oyuncu bu şahı diğer şahlardan
* biriyle yer değiştirip oyuna devam ederse ve daha sonra oyuncunun en yüksek rütbeli şahı tekrar rakibin kalesine hamle yaparsa
 * sayac 2 olur ve bu defa oyun berabere biter.*/
    if( (GameBoard.WhiteCounter==2) || (GameBoard.BlackCounter==2)){
        return Bool.True;
    }
/*Yukaridaki durumlar olmadığı sürece oyun berabere bitmez. */
    return Bool.False;

}

/*Oyunun durumunu kontrol etme */
function CheckResult(){
/*Eğer DeclareDraw fonksiyonu Bool.True değerini dönerse oyun berabere biter.*/
    if(DeclareDraw()==Bool.True){

        $("#GameStatus").text("Game is draw!");

        return Bool.True;
    }
/*Olası hamlelerin hesaplanıp GameBoard.moveList dizisine atayan GenerationMoves fonksiyon çalıştırılır.*/
    GenerationMoves();
    var MoveNum;
    var found=0;

/*Olası hamleler döngüye alınır.*/
    for(MoveNum=GameBoard.moveListStart[GameBoard.ply];MoveNum<GameBoard.moveListStart[GameBoard.ply+1];MoveNum++){

/*Eğer bu hamle yapılamazsa döngünün sonraki adımına geçilir.*/
        if(MakeMove(GameBoard.moveList[MoveNum])==Bool.False){

            continue;
        }
/*Eğer bu hamle yapılabilir ise found değişkeni arttırlır, hamle geri alınır ve döngüden çıkılır.*/
        found++;
        TakeMove();
        break;
    }
/*Hamle sırasına göre oyuncunun en yüksek rütbeli şahı soleKing değişkenine atanır.*/
     var soleKing;

    if(GameBoard.side==COLOURS.WHITE) soleKing=GameBoard.WhiteOnlyKingInGame;
    else soleKing=GameBoard.BlackOnlyKingInGame;
/*soleKing şahının bulunduğu karenin tehdit altında olup olmaığı bilgisi InCheck değişkenine atanır.*/
    var InCheck=SqAttacked(GameBoard.pList[PCEINDEX(soleKing,0)],GameBoard.side^1);

    console.log("InCheck: "+InCheck);
/*Eğer found değişkeni 0 değilse en az yapılacak bir hamle vardır, dolayısıyla oyun bitmez, oyunun devam ettiğini
* fonksiyon Bool.False değerini döndürür.*/
    if(found !=0) return Bool.False;

/*Eğer oyuuncunun son şahı tehdit altında ise */
    if(InCheck==Bool.True){
/*Eğer hamle sırası beyaz oyuncuda ise ve beyaz oyuncunun oyunda sadece bir şahı varsa
* beyaz oyuncu mat edilmiştir. Aynı durum siyah oyuncu için de geçerlidir.*/
        if(GameBoard.side==COLOURS.WHITE && GameBoard.WhiteKingsInGame.length==1){

            $("#GameStatus").text("Black has won!");


            return Bool.True;

        }
        else if(GameBoard.side==COLOURS.BLACK && GameBoard.WhiteKingsInGame.length==1){

            $("#GameStatus").text("White has won!");

            return Bool.True;
        }
    }
/*Eğer yapılacak hamle yoksa ve oyuncunun oyundaki son şahı tehdit altında değilse oyun pata olur.*/
    else {
        if( (GameBoard.side==COLOURS.BLACK && GameBoard.WhiteKingsInGame.length==1) ||
            (GameBoard.side==COLOURS.WHITE && GameBoard.WhiteKingsInGame.length==1)){

            $("#GameStatus").text("Stalemate!");
            return Bool.True;
        }
    }
/*Yukarıdaki durumların hiçbiri gerçekleşmezse fonksiyon oyunun devam edildiği Bool.False değerini döndürerek bildirir.*/
    return Bool.False;

}

function CheckandSet() {

    if(CheckResult()==Bool.True){
        GameController.GameOver=Bool.True;

    }else{
        GameController.GameOver=Bool.False;
        $("#GameStatus").text('');
    }

}

$('#Undo').click(function () {

    if(GameBoard.hisPly>0){

        TakeMove();
        GameBoard.ply=0;
        SetInitialBoardPieces();
    }

});

$('#NewGame').click(function () {

    NewGame(ColorOfPlayer[IndexColorOfPlayer]);

});