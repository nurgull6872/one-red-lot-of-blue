
const canvas = document.getElementById("ourCanvas");// bu metod ile html dokümanına ulaştım
const canvasvar = canvas.getContext("2d");
//bir değişken yarattım ve bu değişkenle çizimlerimi sağlayacağım

const squareSize = 64; // her bir karenin boyutu
const boardSize = 8; // satranç tahtası oluşturmak için 8*8 lik arka plan

let minister = { x: 0, y: 7 }; // başlangıç konumu için nesne bi tane oluşturdum çünkü bir tane minister var
let opponents = [];// düşman mavi daireler için oluşmuş nesne dizisi
var score=0;// ekranda yazdırılacak skor değişkeni değiştirielebilcek
var mmovecnt=0;// oyuncumun karakter sayısı düşmanların hareketini kontrol etmek için var

function designBoard() {  //arka plan olan satranç tahtasını oluşturduğum fonksiyon
  for (let  y = 0; y < boardSize; y++) {
    for ( let x = 0; x < boardSize; x++) {
      //karelerimin renklerini koşul yapısı kullanarak belirledim
        if((x+y)%2==0)
        {
            canvasvar.fillStyle="white" 
        }
        else
           canvasvar.fillStyle="black"
        canvasvar.fillRect(x * squareSize, y * squareSize, squareSize, squareSize); 
        //satranç tahtamın karelerini çizdim 
    }
  }
}
function designMinister() {
  //oyuncu taşını çizen ve boyayan fonksiyonum
  canvasvar.beginPath(); // Yeni şekil için yol başlattım
  canvasvar.fillStyle = "red"; 

  // dairenin x ve y kordinatlarındaki merkezini hesapladım
  var x2 = minister.x * squareSize + squareSize / 2;
  var y2 = minister.y * squareSize + squareSize / 2;
  let radius = squareSize / 2;

  canvasvar.arc(x2, y2, radius, 0, Math.PI * 2);
   // daireyi merkezi olan x y kordinatları ile çizen ctx fonksiyonum
  canvasvar.fill();
}
function designOpponents() {
  // düşman mavi kareleri çizdiğim fonksiyon
  //dizimin uzunluğu kadar gidecek bir for döngüsü ile düşmanlarımı çizip boyadım döngü boyunca
   let i;
  for ( i = 0; i < opponents.length; i++) {
    canvasvar.beginPath();
    canvasvar.fillStyle = "blue";
    var x3=opponents[i].x * squareSize + squareSize / 2;
    var y3=opponents[i].y * squareSize + squareSize / 2;
    let radius2= squareSize/2;
    canvasvar.arc(x3,y3,radius2,0,Math.PI * 2);
    canvasvar.fill();
  }
}
function addEnemy() {
  //başlangıç noktaları math.random fonksiyonu ile random yerlerden başlayacak şekilde 
  // ynin 0  olduğu x in de tahta boyutuna uygun olarak random seçildiği bir değişken 
  // yaratıp opponents nesne listesine attım
  opponents.push({ x: Math.floor(Math.random() * boardSize), y: 0 }); 
  //push metodu sayesinde üstte oluşturulmuş boş nesne dizisine oluşturulan yeni düşmanı attım
}

function moveOpponents() {
//düşmann haraketlerini sağladığım fonksiyon 
  for (var opponent of opponents) {
    if (opponent.y < boardSize ) {
      //eğer düşamnlar hala board içindeyse bir aşağı inebilecekler
      opponent.y += 1;
    }
  }
}

function ministeropponentcollision()
//oyunun temelinde yatan düşman daireleri yemesini sağladığım fonksiyon
{
  //filter fonksiyonu ile belirttiğim koşulu sağlayan dizi elemanlarını yok ettim
   opponents=opponents.filter(opponent=> {
     var distancex= (minister.x-opponent.x)*squareSize;//piksel olarak hesaplanmazsa tam konumu bulamadı
     var distancey= (minister.y-opponent.y)*squareSize;
     var distance = Math.sqrt(distancex*distancex+distancey*distancey);
     if(distance< (squareSize/2))//bu koşula girerse kırmızı maviyi yer ve yukardaki filter fonksiyonu ile mavi silinir
         { 
          runWinSong();
          score++;
          updateScore();
          return false;
        } 
    else
      return true;
      });
}
function updateScore()// web sayfasında scoreu yazdırmak için kullandığım fonksiyon
{
  var innerscore =document.getElementById("score");
  innerscore.innerHTML="SCORE:"+score;
  //innerhtml ile web sayfasındaki değere ulaşıp değiştirebilrim 
}

function showGameOverScreen() {//score değerini defeat ekranında yazdırmak için kullandığım fonksiyonum
  var defeatScreen = document.getElementById("defeatScreen");
  var finalScore = document.getElementById("finalScore");
  finalScore.innerHTML = "Skorun: " + score;//defeat ekranımda yazdırdığım skorum
  defeatScreen.style.display = "flex"; // htmlde none olarak ayarladığımız değeri flex yapıyoruz ki ekranda çıkabilsin
  document.removeEventListener("keydown", direction); // kullanarak klavye ile izin verdiğim hareketleri kısıtladım ve kapattım 
}

function checkDefeat()//oyun bitişini kontrol eden fonksiyonum
{
  //dizilerin some fonksiyonu dizide herhangi bir değer koşulu sağlarsa true döndürür
  var defeatControl=opponents.some(opponent=>opponent.y>7);
  //boolean bir değişken oluşturdum ve bu sayede some fonksiyonundan dönen boolean değeri tuttum 
  if(defeatControl)
  {
    showGameOverScreen();
    runDieSong();
    score=0;
    opponents=[];// maviler yani düşman nesne dizisini sıfırlayrak düşmanları sildim
    minister={x:0,y:7};//oyuncumuz başlangıç yerine döner
    mmovecnt=0;
    return true;
  }else
    return false;
}

function moveMinister(xchange, ychange) { 
//addeventlistenerdan yani kalvye ile kontrolünden gelen case durumlarında çağrılır
   
  // yeni konumu hesapladım ki oyuncumuzun hareketi belli olsun
  let xx = minister.x + xchange;
  let yy = minister.y + ychange;

  if (xx>= 0 && xx < boardSize && yy >= 0 && yy < boardSize) {
     
    minister.x = xx; // oyuncunun yeni x konumu 
    minister.y = yy; // oyuncunun yeni y konumu 
    mmovecnt++;
    if (mmovecnt % 2 === 0) {
      //oyunumun asıl dinamiği olan karakter iki hareket edince düşmanın bir hareket etmesi dinamiğini sağladım
       moveOpponents();
       checkDefeat();
       addEnemy();
       
      }
    ministeropponentcollision();
    //Çarpışma var mı yok mu kontrol ettim ki karşı tarafı yedim mi yemedim mi ona göre düşman azalttım
  }
   updateScore();
   
  // Sonra ekranı yeniden çizdim
   designBoard();  //Satranç tahtasını tekrar çizdirdim çünkü taşlar hareket ettikçe arka planın 
   // yeniden çizilmesi lazım ki taşlar önceki konumlarında durmasın ve taşlar üst üste gelmesin
   designMinister(); // oyuncumu yeni konumu ile yeniden çizmesi için
   designOpponents();  // aynı şekilde düşmanlarım da değiştriği için konumları tekrar çağırıp çizdirdim

}

//bazı browserlar müziklere direkt izin vermediği için ekstra bir klavye hareketi yapmak lazımdı
//addeventlistener ile klavye hareketi ile 
const generalMusic = document.getElementById("backgroundMusic");

function generalSong() {
  generalMusic.play();
  document.removeEventListener("keydown", generalSong);
}

document.addEventListener("keydown", generalSong);

function runWinSong()
{

    //htmlden id ile sesi çektim ve çaldırdım
    var winSound = document.getElementById("eatMusic");
      winSound.currentTime = 0; // sesin her seferinde baştan çalması için şarkının o zamanki zamanını sıfıra çektim
      winSound.play();

}
function runDieSong()
{
     var gameOverSound = document.getElementById("dieMusic");
     gameOverSound.play();//sesi çalması için .play lazımdı
}
  

//klavye aksiyonlarını sağladım
  document.addEventListener("keydown",direction);
   function direction(event)
   {
     switch(event.keyCode)
     { //klavyedeki sayı kodları ile switch case ayarladım ve eğer klavyeden basılırsa ministerımı hareket ettirecek
         case 37:
             moveMinister(-1,0);
             break;
         case 38:
             moveMinister(0,-1);
             break;
        case 39:
             moveMinister(1,0);
              break;
        case 40:
             moveMinister(0,1);
             break;
        case 87:
             moveMinister(-1,-1);
             break;
        case 65:
             moveMinister(-1,1);
             break;
        case 83:
             moveMinister(1,1);
             break;
        case 68:
             moveMinister(1,-1);
             break;
        default:
            break;
    }
 }


  designBoard();
  designMinister();
  //çağırarak ana oyun ekranımı oluşturdum daha sonrasında klavye hareketleri ile üstteki fonksiyonları
  //da çağırarak oyun temel dinamiğini sağladım.
