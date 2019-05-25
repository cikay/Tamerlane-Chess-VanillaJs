function PrSq(sq){

    return (FileChar[FilesBrd[sq]-1] + RankChar[RanksBrd[sq]-1]);
}

/*Tıklanan taşın tıklanan kareye hamle yapıp yapamayacağını kontol edip hamle yapılabilir ise GameBoard.moveList
dizisinden hamlenin tüm değişkenlerini taşıyan değeri döndüren fonksiyon*/
function ParseMove(from,to) {
/*Olası hamlelerin tüm değişkenlerini GameBoard.moveList dizine atayan GenerationMoves() fonksiyon çağrılır.*/
    GenerationMoves();
    var move=NOMOVE;//hamlenin tüm değişkenleri taşıyacak değişkene 0(NOMOVE) değeri atanır.
    var index;//Olası hamlelerin tıklanan hamleleri taranması için gerekli fonksiyon
    var found=Bool.False;//Hamle yapılıp yapılamayacağını kontrole eden değişken


/*Olası tüm hamleler taranır. Bu hamleler GameBoard.moveList dizisinde, GameBoard.moveListStart[GameBoard.ply] ile
GameBoard.moveListStart[GameBoard.ply+1] indeks değerleri arasındadır.
* */
    for(index=GameBoard.moveListStart[GameBoard.ply];
          index<GameBoard.moveListStart[GameBoard.ply+1];index++){
/*Olası hamlenin tüm değişkenlerini tutan değer move değişkenine atanır.*/
        move=GameBoard.moveList[index];
/*move değişkeninden hamleyi yapacak taşın bulunduğu karenin numarası FROMSQ(move) fonksiyonuyla hesaplanır ve
tıklanan taşın bulunduğu kare ile karşılaştırılır, bu değerler birbirine eşit ise; hamlenin yapılacağı karenin numarası
TOSQ(move) fonksiyonuyla hesaplanır, bu değer hamlenin yapılması için tıklanan karenin numarasına eşit
found değişkenine Bool.True değeri atanır.
*/
        if(FROMSQ(move)==from && TOSQ(move)==to){

            console.log("move "+move);
            found=Bool.True;
            break;
        }
//Eğer döngü boyunca bu şart sağlanmazsa found=Bool.False olarak kalır.
    }

/*found değişkeni Bool.False değilse hamlenin yapılabilir olduğu MakeMove fonksiyonu tarafından
* teyit edilir. MakeMove fonksiyonu, bu hamle yapıldığında şahın tehdit altında olup olmadığının kontrol eder, tehdit
* altındaysa Bool.False değeri dönerek hamlenin yapılamayacağını bildirir. Eğer Bool.True değeri dönerse
* hamle yapılabilir, hamleyi geri alır ve move değişkenini döner. MakeMove fonksiyonu burada sadece hamlenin yapılabilir
* olduğuna kontrol etmek için çalıştırıldığından hamlenin geri alınması için TakeMove foksiyonu çalıştırıldı*/
    if(found !=Bool.False){

        if(MakeMove(move)==Bool.False){
////Eğer found değişkeni Bool.False ise hamlenin geri alınması MakeMove fonksiyonu içinde çalıştırılmıştır.
            return NOMOVE;

        }
        TakeMove();
        return move;
    }
//Eğer found değişkeni Bool.False ise hamlenin yapılamayacağı 0 değerini tutan NOMOVE değişkeni döndürülür.
    return NOMOVE;
}

