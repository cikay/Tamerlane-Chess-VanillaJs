/*PieceIsOnSq fonksiyonu, tıklanan yerin bir kare olup olmadığını tespit eder.
* top: Tıklanan noktanın y koordinatı, left. Tıklanan noktanın x koordinatı
*
*
* Tıklanan noktanın x koordinatı 60'a bölünür ve 10'dan çıkarılırsa satır sayısı bulunur. 10'dan çıkarma yapılmasının nedeni satır sayısı ekranda
 *yukarıdan aşığıya doğru azalmaktadır. Sütun numarası, left değişkeni 60'a bölünerek hesaplanır. sq karesinin sütun ve satır numarası
 * hesaplana satır ve sütun numarasıyla karşılatırılır.  Eğer bu değerler birbirine eşit ise fonksiyon Bool.True değeri dönerek tıklanan
 * noktanın bir kare olduğu bildirilir. Eğer bu eşitlikler sağlanmazsa tıklanan nokta bir kare değildir, bunu bildirmek için fonksiyon
 * Bool.False değeri döner*/

function PieceIsOnSq(sq,top,left){

    if(RanksBrd[sq]==10-Math.round(top/60) &&
        FilesBrd[sq]==Math.round(left/60)){

        return Bool.True;
    }
    return Bool.False;
}


/*TakeMovePieces fonksiyonu, tıklanan taşın hamle yapabileceği karelerin renklendirilmesinden önce bu hamle yapıldığında
oyuncuların oyundaki son şahları tehdit altında ise karenin renklendirilmemesi için geçici olarak hamle yapılır.

*/
function T_MovePiece(from,to) {
//Hamle yapacak taş MovedPiece değişkenine atanır.
    MovedPiece=GameBoard.pieces[from];
//Hamle yapılacak karedeki taş TakePiece değişkenine atanır.
    TakePiece=GameBoard.pieces[to];
//Hamle yapan taşın hamle yapmadan önce bulunduğu kare boşaltılır.
    GameBoard.pieces[from]=PIECES.EMPTY;
//Hamle yapan taş hamle yapılacak kareye atanır.
    GameBoard.pieces[to]=MovedPiece;

}
/*T_MovePiece fonksiyonuyla geçici olarak yapılan hamle geri alınır.*/
function TakeMovePieces(from,to) {
//Hamle yapan taş hamle yaptığı kareye atanır.
    GameBoard.pieces[from]=MovedPiece;
//Hamle yapılan karedeki taş tekrar bu kareye atanır.
    GameBoard.pieces[to]=TakePiece;
}
/*Piyonun piyonu ilk kez terfi edince orada kalıp çatallama ya da mahkum taşı tehdit eden hamleyi yapmadığı sürece rakip
* rakip tarafından alınamaz. CapturedPawnOfPawn fonksiyonu piyonun piyonu rakip tarafından alınmaya çalışıldığında bu hamlenin
* yapılamaz olduğu bildirir.*/
function CapturedPawnOfPawn(piece,sq) {
/*sq: Oyundan alınan taşın bulunduğu kare, piece: Hamle yapacak olan taş*/
    var sqOfPofP;
/*Eğer hamle yapacak olan taş siyah oyuncunun taşı ise */
    if(PieceColor[piece]==COLOURS.BLACK){
//Beyaz oyuncunun piyonun piyonunun bulunduğu kare sqOfPofP değişkenine atanır.
        sqOfPofP=GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)];
/*Eğer oyundan alınan taşın bulunduğu kare(hamle yapılacak kare) piyonun piyonunun buluduğu kare,
 beyaz oyuncunun piyonunun piyonunun terfi sayısı 1 ve bu piyon terfi edilen karelerden birinde ise fonksiyon hamlenin
 yapılamayacğını bildirmek için Bool.False değeri döner.*/
        if(sq==sqOfPofP && wPromNumPofP==1 && RanksBrd[sqOfPofP]==WpromotionRank){

            return  Bool.False;
        }

    }else {

        sqOfPofP=GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)];
        if(sq==sqOfPofP && bPromNumPofP==1 && RanksBrd[sqOfPofP]==BpromotionRank){

            return  Bool.False;
        }


    }
/*Eğer bu iki durumda gerçekleşmezse fonksiyon hamlenin yapılabilir olduğunu bildirmek için Bool.True değeri döner.*/
    return Bool.True;


}

/*ProtectedKing fonksiyonu, tıklanan taşın hamle yapacağı karelerin renklendirilmesinden önce renklendirilecek
karelere hamle yapıldığında şahın güvende olduğunu kontrol eder.*/

function ProtectedKing(from,to) {

    var soleKing;
/*Eğer hamle sırası olan oyuncunun oyundaki son şahı soleKing değişkenine atanır.*/
    if(GameBoard.side==COLOURS.WHITE) soleKing=GameBoard.WhiteOnlyKingInGame;

    else soleKing=GameBoard.BlackOnlyKingInGame;

/*Eğer oyuncuların oyunda sadece bir şahı varsa*/
    if(soleKing!=0){
/*Hamle yapılmadan önce şahın tehdit altında olup olmadığı kontrol edilir.
*
* Eğer şah tehdit altında değilse*/
        if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False){
/*Olası hamle yapılır. Hamle yapacak oyuncunun bulunduğu kare numarası hamle yapacağı kare numarası olarak değiştirilir.*/
            T_MovePiece(from,to);
/*Eğer şah yine tehdit altında değilse hamle yapacak taş bulunduğu kareye tekrar atanır ve hamle yapılabilir olduğunu
 bildirmek için fonksiyon Bool.True değerini döner.*/
            if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False){
                TakeMovePieces(from,to);
                return Bool.True;
            }
//Eğer hamle yapıldığında şah tehdit altına giriyorsa hamle geri alınıp fonksiyon hamlenin yapılamayacağını  bildirmek için
//Bool.True değeri döner
            else {
                TakeMovePieces(from,to);
                return Bool.False;
            }
        }
        else{
//Eğer şah tehdit aşltında ise geçici hamke yapılır
            T_MovePiece(from, to);
//Bu hamle yapıldığında şah tehditten kurtuluyorsa
            if (SqAttacked(GameBoard.pList[PCEINDEX(soleKing, 0)], GameBoard.side^1) == Bool.False) {
//Hamle geri alındıktan sonra hamlenin yapılabilir olduğunu bildirmek için fonksiyon Bool.True değeri döner.
                TakeMovePieces(from,to) ;
                return Bool.True;
            }
////Eğer hamle geçici yapıldığında şah tehdit altında ise hamle geri alınır ve hamlenin yapılamaz olduğnunu bildirmek
//için fonksiyon Bool.False değeri döner.
            else{
                TakeMovePieces(from,to);
                return Bool.False;
            }
        }
    }
//Eğer oyuncunun oyunda birden fazla şahı varsa bunları korumak zorunda değildir.
    else if( (GameBoard.side==COLOURS.WHITE && GameBoard.WhiteKingsInGame.length>1) ||
              (GameBoard.side==COLOURS.BLACK && GameBoard.BlackKingsInGame.length>1) ){

        return Bool.True;

    }

    return Bool.False;
}


function ShowSquaresPieceCanMove(from,clickedPiece) {

    var index,move;

    $(".Square").each(function () {


        for(index=GameBoard.moveListStart[GameBoard.ply];
            index<GameBoard.moveListStart[GameBoard.ply+1];index++){

            move=GameBoard.moveList[index];

            if(FROMSQ(move)==from && ProtectedKing(from,TOSQ(move))==Bool.True &&
                CapturedPawnOfPawn(clickedPiece,TOSQ(move))==Bool.True &&
                PieceIsOnSq(TOSQ(move),$(this).position().top,$(this).position().left)==Bool.True){

                $(this).addClass("SqAttacked");
            }
        }
    });
}


