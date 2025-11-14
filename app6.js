const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

  
app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;
  console.log( {hand, win, total});



  // 初回アクセス（手が未入力）の場合の処理
  if (!hand) {
      // 統計情報（全て0）のみを渡してレンダリングし、処理を終了
      return res.render('janken', {
          your: '?',
          cpu: '?',
          judgement: '手を決めてください',
          win, lose, even, total
      });
  }

  // // --- 1. 変数の初期化と取得 ---
  // let hand = req.query.hand;
  // let win = Number( req.query.win );
  // let lose = Number( req.query.lose );   // 負け数を取得
  // let even = Number( req.query.even );   // あいこ数を取得 (HTML側のhidden fieldsに追加が必要です)
  // let total = Number( req.query.total );

  // console.log( {hand, win, lose, even, total} );
  
  // --- 2. CPUの手を決定 ---
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num === 1 ) cpu = 'グー';
  else if( num === 2 ) cpu = 'チョキ';
  else cpu = 'パー';

  // --- 3. 勝敗の判定と集計ロジックの適用 ---
  const judgement = jankenJudge(hand, cpu); // 定義した関数をここで呼び出す！

  if (judgement === '勝ち') {
    win += 1;
  } else if (judgement === '負け') {
    lose += 1;
  } else if (judgement === 'あいこ') {
    even += 1;
  }
  
  total += 1; // 試合数を増やす

  // --- 4. テンプレートに渡すデータ (display) ---
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement, // 勝ち, 負け, あいこのいずれかの文字列が入る
    win: win,
    lose: lose,
    even: even, // 渡す変数を追加
    total: total
  }
  // 💡 ADDED: 更新した統計をセッションに保存
  req.session.results = { win, lose, even, total }; // 👈 この行を追加する！
  res.render( 'janken', display );
});
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する

  


app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log( req.query );
  const num1 = Number( req.query.num1 );
  const num2 = Number( req.query.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

// --- app.get(...) の外側に定義する ---
function jankenJudge(myHand, opponentHand) {
    // 1. あいこの判定
    if (myHand === opponentHand) {
        return 'あいこ';
    } 
    // 2. 負けの判定 (相手が勝つパターン)
    if (
        (myHand === 'パー' && opponentHand === 'チョキ') ||
        (myHand === 'グー' && opponentHand === 'パー') ||
        (myHand === 'チョキ' && opponentHand === 'グー')
    ) {
        return '負け';
    } 
    // 3. 勝ちの判定 (残りのパターン)
    return '勝ち';
}
// ----------------------------------------

app.post("/add", (req, res) => {
  console.log("POST");
  console.log( req.body );
  const num1 = Number( req.body.num1 );
  const num2 = Number( req.body.num2 );
  console.log( num1 );
  console.log( num2 );
  res.json( {answer: num1+num2} );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
