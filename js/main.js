$(function () {

    console.log("main init fonksiyonu çağrıldı");
    Init();

    NewGame(ColorOfPlayer[IndexColorOfPlayer]);
    console.log("RandomNumber   "+RandomNumber);
    console.log("IndexColorOfPlayer "+IndexColorOfPlayer);
});


/*InitFilesRanksBrd fonksiyonu, karelerin bulundukları satır numaralarını RanksBrd, sütun numaralarını ise FilesBrd dizisi atama yapar.*/
function InitFilesRanksBrd() {

    var index;
    var rank;
    var file;
    var sq;

 /*18*15 tahtanın tüm karelerin satır ve sütun numaraları 209 yapılır.*/
    for(index=0;index<BRD_SQ_NUM;index++){
        FilesBrd[index]=SQUARES.OFF_BOARD;
        RanksBrd[index]=SQUARES.OFF_BOARD;
    }

/*FR2SQ fonksiyonuyla karelerin numarası hesaplanır, hesaplanan bu kare numarası
 FilesBrd ve RanksBrd dizilerinin indekslerine olarak belirlenip sırasıyla sütun ve satır numaraları atanır.*/
    for(rank=Ranks.Rank_1;rank<=Ranks.Rank_10;rank++){
        for(file=Files.Files_1;file<=Files.Files_11;file++){
            sq=FR2SQ(file,rank);
            FilesBrd[sq]=file;
            RanksBrd[sq]=rank;
        }

    }
/*Kale olarak adlandırılan karelerin satır ve sütun numaraları dizilere atanır.*/
    FilesBrd[181]=0;
    RanksBrd[181]=9;      // yan taraftaki
    FilesBrd[88]=12;       // kareler için
    RanksBrd[88]=2;

}


function  InitHashKeys() {

    var index;

    for(index=0;index<20*270;index++){

        PieceKeys[index]=RAND_32();
    }
    SideKey=RAND_32();
}
/*InitSq342to112 fonksiyonuyla 18*15 karelik tahtanın içindeki 10*11
kareden oluşan gerçek tahtanın kare numaralarının hesaplanıp sq342to112 dizisine atanır.*/
function  InitSq342to112() {

    var index = 0;
    var rank;
    var file;
    var sq ;
    var sq112 = 0;

    for (index; index < BRD_SQ_NUM; index++) {
        sq270to112[index] = 113;
    }
/*18*15 tahtanın içindeki 10*11 tahtanın tüm karelerine 18*15 tahtanın en büyük kare numarası olan 270 değeri atanır.
 10*11 tahtanın kare numaralarından biri olmamak üzere herhangi başka bir değer de atanabilir.

 */
    for (index = 0; index < 112; index++) {
        sq112to270[index] = 270;

    }
/*10*11 tahtanın kare numaraları FR2SQ fonksiyonuyla hesaplanıp sq112to270 dizisine atanır.*/
    for (rank = Ranks.Rank_1; rank <= Ranks.Rank_10; rank++) {

        for (file = Files.Files_1; file <= Files.Files_11; file++) {

            sq = FR2SQ(file, rank);
            //sq270to112[sq] = sq112;
            sq112to270[sq112] = sq;
            sq112++;
        }
    }
/*Kale olrak adlandırılan kareler numaralandırılır.*/
    sq112to270[110]=88;
    sq112to270[111]=181;


}

/*
function SQ342(sq112) {
    return sq112to270[(sq112)];
}
*/

function InitBoardVars(){

    var index;
    for(index=0;index<MAXGAMEMOVES;index++){

        GameBoard.history.push({
            move:NOMOVE,
            PosKey:0,
        });
    }

}


/*Tahtanın ekrandaki tasarımı*/
function tahta() {

    var light = 0,rank_num,rank_name,file_num,file_name,colorOfSq,createDiv,createDiv1,createDiv2;
    for (rank_num = Ranks.Rank_1; rank_num <= Ranks.Rank_10; rank_num++) {
        light ^= 1;
        rank_name = "rank" + (rank_num);
        for (file_num = Files.Files_1; file_num <= Files.Files_11; file_num++) {
            file_name = "file" + (file_num);
            (light == 0) ? colorOfSq = "light" : colorOfSq = "dark";

            createDiv = "<div class=\"Square " + rank_name + " " + file_name + " " + colorOfSq + "\" >";
            (file_num !=Files.Files_11) ? light ^= 1 : 0;
            $("#board").append(createDiv);
        }
    }
    createDiv1 = "<div class=\"Square " + "rank2 " + "file12 " + "dark " + "\" />";
    createDiv2 = "<div class=\"Square " + "rank9 " + "file0 " + "light" + "\" />";
    $("#board").append(createDiv1);
    $("#board").append(createDiv2);
}

function Init() {
    console.log("init() fonksiyonu çağrıldı");
    InitFilesRanksBrd();
    InitHashKeys();
    InitSq342to112();
    InitBoardVars();
    tahta();

}




