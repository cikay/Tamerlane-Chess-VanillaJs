
/*ClearPiece fonksiyonu, hamle yapan taşın hamle yapmadan önce bulunduğu kareyi ve oyundan alınan taşın bulunduğu kareyi boşaltır.*/
function  ClearPiece(sq) {
/* sq karesindeki taş pce değişkenine atanır.*/
    var pce=GameBoard.pieces[sq];
    var index;
    var t_pceNum=-1;

    HASH_PCE(pce,sq);
/*sq karesine PIECES.EMPTY değeri atanarak kare boşaltılır.*/
    GameBoard.pieces[sq]=PIECES.EMPTY;
/*GameBoard.pList dizisinde pce taşının bulunduğu kareyi bulmak için pce taşının
GameBoard.piecesNUMBER dizisinde numarasına ihtiyaç duyulur. Bu yüzden taşların numarasını tutan GameBoard.piecesNUMBER dizisinin
 .*/
    for(index=0;index<GameBoard.piecesNUMBER[pce];index++){
//GameBoard.pList dizisinde pce taşının bulunduğu karenin numarası bulunursa
        if(GameBoard.pList[PCEINDEX(pce,index)]==sq){
            t_pceNum=index;
            break;

        }
    }
    GameBoard.piecesNUMBER[pce]--;
    GameBoard.pList[PCEINDEX(pce,t_pceNum)]=GameBoard.pList[PCEINDEX(pce, GameBoard.piecesNUMBER[pce])];


}

/*AddPiece fonksiyonu, hamle yapılacak kareye hamle yapan taşı ekler.*/
function AddPiece(sq,pce) {

    HASH_PCE(pce,sq);
/*Hamle yapan pce taşı, GameBoard.pList dizisinin hamle yapılan sq kare numarası indeksine atanır. */
    GameBoard.pieces[sq]=pce;
/*sq karesi, pce taşı ve numarasına göre PCEINDEX fonksiyonuyla hesaplanan GameBoard.pList dizisinin indeksine atama yapar.

*/
    GameBoard.pList[PCEINDEX(pce,GameBoard.piecesNUMBER[pce])]=sq;
//Clear fonksiyonuyla azaltılan pce taşının numarası artırılır.
    GameBoard.piecesNUMBER[pce]++;

}

/*MovePiece fonksiyonu, taşların hareket edebilmesi için bulundukları karelerden silip
hamle yapacakları karelere ekler.*/
function  MovePiece(from,to,move) {

    var index;
/*Hamle yapacak olan taş pce değişkenine atanır.*/
    var pce=GameBoard.pieces[from];

    HASH_PCE(pce,from);
/*Hamle yapacak olan taşın buluğu kare boşaltılır.*/
    GameBoard.pieces[from]=PIECES.EMPTY;
/*Eğer en yüksek rütbeli şah diğer şhlardan biriyle yer değiştirmesi gerekiyorsa ya da
*oyuncunun oyundaki son şahı diğer taşlarından herhangi biriyle yer değiştirmesi gerekiyorsa  */
    if( (move & MFLAGSWITCHKING)!=0 || (move & MFLAGSWITCHANYPIECE)!=0){
/*Hamle yapılacak karedeki taş, hamle yapılan kareye atanır. Aşağıda pce değişkeni hamle yapılacak kareye eklenince de
* taşların bulundukları kareler yer değiştirmiş olur.*/
        GameBoard.pieces[from]=GameBoard.pieces[to];
        GameBoard.pList[PCEINDEX(GameBoard.pieces[from],0)]=from;
    }


    HASH_PCE(pce,to);
/*pce değişkeni hamle yapılacak kareye atanır */
    GameBoard.pieces[to]=pce;
/*pce taşının bulunduğu bulunduğu kareyi GameBoard.pList dizisinde değiştirmek için bu taşın numarasına ihtiyaç duyulur.
Bu yüzden GameBoard.piecesNUMBER dizisiyle bu taşın numarası tespit edilir.
 Bunun için GameBoard.piecesNUMBER dizisi döngüye alınır. */
    for(index=0;index<GameBoard.piecesNUMBER[pce];index++){
/*pce taşının numaraları teker teker taranarak pce taşının bulunduğu kare from karesine eşit olup olmadığı kontrol edilir.
*Bu eşitlik sağlandığında pce taşının numarası index değişkenidir. */
        if(GameBoard.pList[PCEINDEX(pce,index)]==from){
//to değişkeni, pce taşına  ve numarasına göre hesaplanan GameBoard.pList dizisnin indeks değerine atama yapılır ve döngüden çıkılır.
            GameBoard.pList[PCEINDEX(pce,index)]=to;
            break;
        }
    }
}

function ClearKing(piece) {

    var index;
/*Oyumdan alınan şahı tespit edip şahların tanımlı olduğu LoopKings dizisinden silmek
 için bu dizi döngüye alınır.*/
    for(index=0;index<LoopKings.length;index++){
/*oyundan alınan piece taş, LoopKings dizisinin herhangi bir elemanına eşit ise */
        if(LoopKings[index]==piece){
/*Bu şahı LoopKings dizisinden splice metoduyla indeks değeri(index) ve silinecek eleman sayısı(1)
değişkenleri girilerek silinir.*/
            LoopKings.splice(index,1);
        }
    }
/*Eğer oyundan alınan taş, beyaz oyuncunun şahlarında biri ise bu şah beyaz oyuncunun şahlarının
tutulduğu diziden(GameBoard.WhiteKingsInGame) yukarıda açıklanan splice metoduyla benzer şekilde bu diziden silinir.
Siyah şahların LoopKings dizisindeki başlangıç indeks değeri(LoopKingsIndex[1]) 1 azaltılır. Çünkü
dizide siyah şahlar, beyaz şahlardan sonra listelenmişti. Beyaz şahlardan biri eksildiğine göre siyah şahların başlangıç indeks
değeri de 1 eksilmelidir.*/

    for(index=0;index<GameBoard.WhiteKingsInGame.length;index++){
        if(GameBoard.WhiteKingsInGame[index]==piece){

            GameBoard.WhiteKingsInGame.splice(index,1);
            LoopKingsIndex[1]--;

        }
    }
/*Eğer oyundan alınan taş, en yüksek rütbeli şah ise oyundaki en yüksek rütbeli şah değişmelidir.
* */
    if(piece==GameBoard.WhiteHighestRanKING){
        /*Eğer beyaz oyuncunun iki şahı varsa(prens ve sonradan gelen şah) prens daha yüksek rütbeli polduğu için
         * en yüksek rütbeli şah değişkenine(GameBoard.WhiteHighestRanKING) prens taşı atanır.  */
        if(GameBoard.WhiteKingsInGame.length==2) GameBoard.WhiteHighestRanKING=PIECES.Wprince;
/*Eğer beyaz oyuncunun oyunda sadece bir şahı varsa bu şah, en yüksek rütbeli şah değişkenine atanır. Ve şahın
tehdit altında olup olmadığı kontrol etmek için GameBoard.WhiteOnlyKingInGame değişkenine, oyundaki
tek şah atanır(GameBoard.WhiteKingsInGame[0]).
 */
        else if(GameBoard.WhiteKingsInGame.length==1){

            GameBoard.WhiteHighestRanKING=GameBoard.WhiteKingsInGame[0];
            GameBoard.WhiteOnlyKingInGame=GameBoard.WhiteKingsInGame[0];
        }
    }
//Siyah oyuncu için yukarıda açıklananların aynısı olduğundan açıklamanın yinelenmesine gerek duyulmamıştır.
    for(index=0;index<GameBoard.BlackKingsInGame.length;index++){
        if(GameBoard.BlackKingsInGame[index]==piece){
            GameBoard.BlackKingsInGame.splice(index,1);

        }
    }
    if(piece==GameBoard.BlackHighestRanKING){
        if(GameBoard.BlackKingsInGame.length==2) GameBoard.BlackHighestRanKING=PIECES.Bprince;
        else if(GameBoard.BlackKingsInGame.length==1){

            GameBoard.BlackHighestRanKING=GameBoard.BlackKingsInGame[0];
            GameBoard.BlackOnlyKingInGame=GameBoard.BlackKingsInGame[0];
        }
    }

}
/*
* AddKing fonksiyonu , terfi olan taş prens veya sonradana gelen şah ise şahların tutulduğu dizilere bu taşı ekler.
* */

function AddKing(promPiece) {
/*Terfi olan taşın değerini tutan promPiece değişkeni beyaz oyuncunun prensi ya da sonradan gelen şahı ise  */

    if(promPiece==PIECES.Wprince || promPiece==PIECES.WadKing){
/*Oyundaki son şahın değerini tutan GameBoard.WhiteOnlyKingInGame değişkeniş sıfırlanır.*/
        GameBoard.WhiteOnlyKingInGame=PIECES.EMPTY;
/*promPiece değişkeni beyaz şahların tutulduğu GameBoard.WhiteKingsInGame diziye eklenir.*/
        GameBoard.WhiteKingsInGame.push(promPiece);
/*Tüm şahların tuluduğu LoopKings dizisinin başına da promPiece değişkeni eklenir, bu eklemeden sonra
 * siyah taşların indeks değeri 1 artacağından LoopKingsIndex[1] değişkeni 1 artırılır.*/
        LoopKingsIndex[1]++;
        LoopKings.unshift(promPiece);

    }
/*Siyah oyuncunun şahlarının gerekeli dizilere eklanmesi
sadece beyaz oyuncu için yapılana açıklamadan faklı olan kısımlar açıklanmıştır. */

    else if(promPiece==PIECES.Bprince || promPiece==PIECES.BadKing){

        GameBoard.BlackOnlyKingInGame=PIECES.EMPTY;
        GameBoard.BlackKingsInGame.push(promPiece);
/*Siyah oyuncunun şahları LoopKings dizisinde beyaz oyuncunukinden sonra geldiği için
 *promPiece değişkeni bu dizinin son elemanı olan 0 değeriyle değiştirilip dizinin sonuna 0 değeri yine
 * eklenir.
  * */
        LoopKings.splice(LoopKings.length-1,2,promPiece,0);
    }
}

/*Eğer oyuncunun sadece bir şahı varsa ve bu şah rakbin kalesinde ise bu şah bu kareden çıkmak zorundadır.
*SoleKingMustGetOutOfOpponnetCitadel fonksiyonu, bu şahın rakibin kalesinden çıkmadığı sürece hamle yapılmasını önlemek için bildirim yapar.
* Algoritma aynı olduğu için gereli açıklamalar sadece beyaz oyuncu için yapılmıştır.*/
function SoleKingMustGetOutOfOpponnetCitadel(side) {

    var index;
/*Beyaz oyuncunun oyundaki son şahın bulunduğu kare WsqOfKing, siyah oyuncununki ise BsqOfKing değişkenine atanır.*/
    var WsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.WhiteOnlyKingInGame,0)];
    var BsqOfKing=GameBoard.pList[PCEINDEX(GameBoard.BlackOnlyKingInGame,0)];

/*Eğer beyaz oyuncunun oyundaki son şahı asıl şah değil, bu şah rakibin kalesinde ve hamle sırası beyaz oyuncuda ise */
    if( GameBoard.WhiteOnlyKingInGame!=PIECES.Wking && WsqOfKing==BsideCitadel && side==COLOURS.WHITE){
/*Şahın hamle yapacağı kareler, siyah oyuncunun kalesine komşu olan karelerdir. Bu karelerin numarasını tutan BkomsuOfCitadel dizisi
 döngüye alınır*/
        for(index=0;index<BkomsuOfCitadel.length;index++){

            console.log(BkomsuOfCitadel[index]);
/*Eğer bu kareler tehdit altında değilse hamle yapılmaması bildirmek için fonksiyon Bool.True değeri döner.*/
            if(SqAttacked(BkomsuOfCitadel[index],COLOURS.BLACK)==Bool.False){

                console.log("beyaz şah kaleden çıkmalı");

                return Bool.True;
            }
        }

    } else if(GameBoard.BlackOnlyKingInGame!=PIECES.Bking && BsqOfKing==WsideCitadel && side==COLOURS.BLACK){

        for(index=0;index<WkomsuOfCitadel.length;index++){

            if(SqAttacked(WkomsuOfCitadel[index],COLOURS.WHITE)==Bool.False){

                console.log("siyah şah kaleden çıkmalı");

                return Bool.True;
            }
        }
    }
/*Eğer bu iki durum da gerçekleşmezse fonksiyon hamlenin yapılabilir olduğunu bildirmek için Bool.False değeri döner*/
    return Bool.False;
}


/*Hamlenin yapıldığı fonksiyon*/
function MakeMove(move) {
/*move, hamlenin tüm değişkenlerini tutan değişkendir. FROMSQ fonksiyonu, move değişkeninden hamle yapacak taşın bulunduğu kareyi,
TOSQ  fonksiyonu ise hamle yapılacak kare numarasını hesaplar.
*/
    var from=FROMSQ(move);
    var to=TOSQ(move);
/*Hamle yapılacak karedeki taş, ki bu hamle yapacak taştır, pce değikenine atanır.
* */
    var piece=GameBoard.pieces[from];

//side değişkenine hamle sırası olan oyuncu atanır.
    var side=GameBoard.side;
    GameBoard.history[GameBoard.hisPly].PosKey=GameBoard.PosKey;
    GameBoard.history[GameBoard.hisPly].move=move;
//CAPTURED fonksiyonu, move değişkeninden oyundan alınan taşın numarasını hesaplayıp captured değişkenine atama
// yapar.
    var captured=CAPTURED(move);

    if(captured !=PIECES.EMPTY) {//Eğer captured değişkeni boş değilse yani oyundan alınan bir taş varsa
//Bu taş hamle yapılacak karededir. Dolayısıyla bu karedeki taş silinir.
        ClearPiece(to);
//Eğer bu taş şahlardan biri ise ClearKing fonksiyonuyla gerekli dizilerden silinir.
        ClearKing(captured);

    }

//Hamle sayısı(GameBoard.ply) ve geçmiş hamle sayısı(GameBoard.hisPly) artırılır.
    GameBoard.hisPly++;
    GameBoard.ply++;
//MovePice fonksiyonu çalıştırılır.
    MovePiece(from,to,move);
//PROM fonksiyonu, move değişkeninde terfi eden taşın olup olmadığını belirler ve bu değeri promotion değişkenine atama
// yapılır.
    var promotion=PROM(move);

//Eğer promotion değişkeni 1 ise terfi edilecek piyon vardır.
   if(promotion ==Bool.True){
//piece değişkeni, Promoted fonksiyonuna gönderilerek terfi edilen taş hesaplanıp PromPce değişkenine atanır.
       var PromPce=Promoted(piece);
//Terfi olan piyonu silmek için ClearPiece fonksiyonu çalıştırılır.
       ClearPiece(to);
//PromPce, hamle yapılan kareye(to) eklenir.
       AddPiece(to,PromPce);
/*Terfi olan taş, prens veya sonradan gelen şah ise AddKing fonksiyonuyla gerekli dizilere atanır.*/
       AddKing(PromPce);

   }
//hamle yapıldığı için hamle sırası olan oyuncu değişir
   GameBoard.side ^=1;
   HASH_SIDE();

    var soleKing;
/*Hamleyi yapan oyuncu beyaz ve oyundaki son şahı(GameBoard.WhiteOnlyKingInGame) 0 değilse bu değişken soleKing değişkenine atanır. */

    if(side==COLOURS.WHITE && GameBoard.WhiteOnlyKingInGame!=0) soleKing=GameBoard.WhiteOnlyKingInGame;
/*Hamleyi yapan oyuncu siyah ve oyundaki son şahı(GameBoard.BlackOnlyKingInGame) 0 değilse bu değişken soleKing değişkenine atanır. */
    else if(side==COLOURS.BLACK && GameBoard.BlackOnlyKingInGame!=0) soleKing=GameBoard.BlackOnlyKingInGame;
//Bu iki durumun dışında soleKing değişkenine 0 değeri atanır.
    else soleKing=0;
    console.log("soleKing: "+soleKing);

//Eğer soleKing değişkeni hamle sırası olan oyuncu tarafından tehdit altındaysa
    if(SqAttacked(GameBoard.pList[PCEINDEX(soleKing,0)], GameBoard.side) ){

        console.log("tehdit altında!!!");
//Hamle geri alınır ve fonksiyon Bool.False değeri döner.
        TakeMove();
        return Bool.False;
    }
/*Eğer piyonun piyonu oyundan alınamaz durumdayken alınmaya çalışılıyorsa ya da oyundaki son şah
 * hamle yapan oyuncunun oyundaki son şahı rakibin kalesinde ise hamle geri alınır ve fonksiyon Bool.False
 * değeri döner.
  * */
    else if(CapturedPawnOfPawn(piece,to)==Bool.False || SoleKingMustGetOutOfOpponnetCitadel(side)==Bool.True){

        TakeMove();
        return Bool.False;

    }
/*Eğer bu iki durum da gerçekleşmezse hamlenin yapılabilir olduğunu bildirmek için fonksiyon Bool.True değeri döner.*/
    return Bool.True;
}

/*TakeMove fonksiyonu, hamlenin yapılamayacağı bildirisi MakeMove fonksiyonundan gelince yapılan işlemleri geri alır.*/
function TakeMove() {
/*Hamle sayısı ve geçmiş hamle sayısı azaltılır.*/
    GameBoard.ply--;
    GameBoard.hisPly--;
/*Yapılamayan hamlenin tüm değişkenlerini tutan değer(GameBoard.history[GameBoard.hisPly].move), move değişkenine atanır.*/
    var move=GameBoard.history[GameBoard.hisPly].move;
/*move değişkeninde hamle yapamayan oyuncunun bulunduğu kare, FROMSQ; hamle yapılamayan kare ise TOSQ fonksiyonuyla hesaplanır. */
    var from=FROMSQ(move);
    var to=TOSQ(move);
/*Hamel yapılamayan karedeki taş Pce değişkenine atanır.*/
    var Pce=GameBoard.pieces[to];

    console.log("Pce  "+Pce);
/*Hamle sırası tekrar aynı oyuncuya verilir.*/
    GameBoard.side ^=1;
    HASH_SIDE();
/*MovePiece fonksiyonuna hamle yapılacak kare olarak from, hamle yapan taşın bulunduğu kare olarak to değişkenleri atanarak
 * GameBoard dizisinde taşların bulunduğu indeks değerleri yer değiştirerek hamle yapılmadan önceki kare indeks değerlerine atanırlar. */
    MovePiece(to,from,move);
/*move değişkeninden CAPTURED fonskiyonuyla oyundan alınan taş captured değişkenine, PROM fonksiyonuyla promoted değişkenine atanır, */
    var captured=CAPTURED(move);
    var promoted=PROM(move);
/*Eğer oyundan alınan bir taş varsa */
    if(captured != PIECES.EMPTY){
/*Bu taş alındığı kareye tekrar eklenir. AddKing fonksiyonuyla alınan taşın şahlardan biri olması durumunda gerekli dizilere tekrar eklenir.  */
        AddPiece(to,captured);
        AddKing(captured);
    }
/*Eğer terfi eden bir taş varsa */
    if(promoted == Bool.True){
/*Hamle yapamayan taşın bulunduğu kare temizlenir, bu kareye TakePromoted fonksiyonuyla taşın
piyonu eklenir. ClearKing Fonksiyonuyla terfi olan taş şahlardan biri ise bu taş gerekli dizilerden silinir. */
        ClearPiece(from);
        AddPiece(from, TakePromoted(Pce));
        ClearKing(Pce);

    }
}

/*Hamle yapılamaz durumda ulduğu tespit edildiğinde yapılan işlemler geri alınır. TakePromoted fonksiyonu
* terfi etme işlemini geri alır.*/
function TakePromoted(PromPce) {

    var PawnOf;
/*Terfi olan taş, bu taşın piyonuna dönüştürülür. Eğer bu taş piyonun piyonu ise aynı kalır, ama eğer onradan gelen şah
* ise piyonun piyonuna dönüştürülür. Her taşın piyonu, PawnOf değişkenine atanır ve fonksiyon bu değeri döner.*/
    switch (PromPce) {

        case PIECES.WpOfPawn: PawnOf=PIECES.WpOfPawn; break;
        case PIECES.WadKing: PawnOf=PIECES.WpOfPawn; break;
        case PIECES.Wrook: PawnOf=PIECES.WpOfRook; break;
        case PIECES.Wadvisor: PawnOf=PIECES.WpOfAdvisor; break;
        case PIECES.Wminister: PawnOf=PIECES.WpOfMinister; break;
        case PIECES.Wknight: PawnOf=PIECES.WpOfKnight; break;
        case PIECES.Wgiraffe: PawnOf=PIECES.WpOfGiraffe; break;
        case PIECES.Wwarengine: PawnOf=PIECES.WpOfWarengine; break;
        case PIECES.Wcamel: PawnOf=PIECES.WpOfCamel; break;
        case PIECES.Wprince: PawnOf=PIECES.WpOfKing; break;
        case PIECES.Wcatapult: PawnOf=PIECES.WpOfCatapult; break;
        case PIECES.Welephant:  PawnOf=PIECES.WpOfElephant; break;

        case PIECES.BpOfPawn:  PawnOf=PIECES.BpOfPawn; break;
        case PIECES.BadKing: PawnOf=PIECES.BpOfPawn; break;
        case PIECES.Brook: PawnOf=PIECES.BpOfRook; break;
        case PIECES.Badvisor: PawnOf=PIECES.BpOfAdvisor; break;
        case PIECES.Bminister: PawnOf=PIECES.BpOfMinister; break;
        case PIECES.Bknight: PawnOf=PIECES.BpOfKnight; break;
        case PIECES.Bgiraffe: PawnOf=PIECES.BpOfGiraffe; break;
        case PIECES.Bwarengine: PawnOf=PIECES.BpOfWarengine; break;
        case PIECES.Bcamel: PawnOf=PIECES.BpOfCamel; break;
        case PIECES.Bprince:PawnOf=PIECES.BpOfKing;break;
        case PIECES.Bcatapult: PawnOf=PIECES.BpOfCatapult; break;
        case PIECES.Belephant: PawnOf=PIECES.BpOfElephant; break;

    }

    return PawnOf;
}

/*Promoted fonksiyonu, piyonları piyonu olduğu taşlara terfi ettirir.*/
function Promoted(piece) {

    var PromPiece;
/*Eğer terfi edilecek olan piece piyonu, piyonun piyonu ve terfi sayısı 2 ise(yani 3. kez terfi edilecekse)
* sonradan gelen şaha terfi eder.
Beyaz oyuncunun için sonradan gelen şahı PIECES.WadKing, siyah oyuncununki PIECES.BadKing  promPiece değişkenine atanır.
GameBoard.pList dizisinde piyonun piyonunun indeks değeri(bu bulunduğu kare oluyor) boşaltılır. Ardından fonksiyon
promPiece değişkeni döndürür.*/

    if(piece==PIECES.WpOfPawn && wPromNumPofP==2){
        PromPiece=PIECES.WadKing;
        GameBoard.pList[PCEINDEX(PIECES.WpOfPawn,0)]=PIECES.EMPTY;
        return PromPiece;
    }
    else if(piece==PIECES.BpOfPawn && bPromNumPofP==2){
        PromPiece=PIECES.BadKing;
        GameBoard.pList[PCEINDEX(PIECES.BpOfPawn,0)]=PIECES.EMPTY;
        return PromPiece;
    }

/*Eğer terfi edilicek taş, piyonun piyonun dışında bir taş ise piyonu olduğu taşa terfi eder. Eğer
bu taş piyonun piyonu ama terfi sayısı 2 değilse piyonun piyonu olarak kalır, ama terfi sayısı grafiksel arayüz fonksiyonu
olan MoveGuiPiece fonksiyonda artırılır.*/

    switch (piece) {

        case PIECES.WpOfPawn: PromPiece=PIECES.WpOfPawn; break;
        case PIECES.WpOfRook: PromPiece=PIECES.Wrook; break;
        case PIECES.WpOfAdvisor: PromPiece=PIECES.Wadvisor; break;
        case PIECES.WpOfMinister: PromPiece=PIECES.Wminister; break;
        case PIECES.WpOfKnight: PromPiece=PIECES.Wknight; break;
        case PIECES.WpOfGiraffe: PromPiece=PIECES.Wgiraffe; break;
        case PIECES.WpOfWarengine: PromPiece=PIECES.Wwarengine; break;
        case PIECES.WpOfCamel: PromPiece=PIECES.Wcamel; break;
        case PIECES.WpOfKing:PromPiece=PIECES.Wprince; break;
        case PIECES.WpOfCatapult: PromPiece=PIECES.Wcatapult; break;
        case PIECES.WpOfElephant:  PromPiece=PIECES.Welephant; break;

        case PIECES.BpOfPawn: PromPiece=PIECES.BpOfPawn; break;
        case PIECES.BpOfRook: PromPiece=PIECES.Brook; break;
        case PIECES.BpOfAdvisor: PromPiece=PIECES.Badvisor; break;
        case PIECES.BpOfMinister: PromPiece=PIECES.Bminister; break;
        case PIECES.BpOfKnight: PromPiece=PIECES.Bknight; break;
        case PIECES.BpOfGiraffe: PromPiece=PIECES.Bgiraffe; break;
        case PIECES.BpOfWarengine: PromPiece=PIECES.Bwarengine; break;
        case PIECES.BpOfCamel: PromPiece=PIECES.Bcamel; break;
        case PIECES.BpOfKing:PromPiece=PIECES.Bprince; break;
        case PIECES.BpOfCatapult: PromPiece=PIECES.Bcatapult; break;
        case PIECES.BpOfElephant: PromPiece=PIECES.Belephant; break;

    }
//fonksiyon terfi olan taşı döndürür.
    return PromPiece;
}



