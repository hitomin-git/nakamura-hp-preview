const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const lines = ['# Issue #11 結合テスト', '', '対象: fix/11-deliver-preview-to-main。チェックリスト確認済み。指定 .Codex/CHECKLISTS.md は存在せず、司令塔 .claude/CHECKLISTS.md を代用。', 'ブラウザ操作は依頼範囲外。DOMスタブでデータ読込→カード生成→補助文削除を通し検証する。', ''];
function cmd(command, args) {
  const output = execFileSync(command, args, {encoding:'utf8'}).trim();
  lines.push('```text', '> '+[command,...args].join(' '), output || '(出力なし)', 'exit code: 0', '```', '');
  return output;
}
function pass(message) { console.log('PASS '+message); lines.push('- PASS '+message); }
try {
  cmd('git',['rev-parse','HEAD']);
  cmd('git',['rev-parse','origin/main']);
  assert.equal(cmd('git',['diff','--name-only','447fa5f','HEAD']), '');
  assert.equal(cmd('git',['diff','447fa5f','--','index.html','css','js','picture','concerns']), '');
  pass('447fa5f と復旧HEADの全追跡ファイル一致。作業ツリーのサイトファイルも一致。');
  const files = cmd('git',['diff','--name-only','origin/main','HEAD']).split('\n');
  assert.deepEqual(files,['css/reviews.css','index.html','js/reviews.js','logs/5/verification.md','logs/7/verification.md','logs/9/verification.md']);
  const html = fs.readFileSync('index.html','utf8');
  const oldHtml = execFileSync('git',['show','origin/main:index.html'],{encoding:'utf8'});
  function sections(s) { return [...s.matchAll(/<section\b[\s\S]*?<\/section>/g)].map(x=>x[0].replace(/\r\n/g,'\n')); }
  assert.deepEqual(sections(html).sort(),sections(oldHtml).sort());
  const stripped = s=>s.replace(/<section\b[\s\S]*?<\/section>/g,'').replace(/\s+/g,'');
  assert.equal(stripped(html),stripped(oldHtml));
  assert(html.indexOf('id="approach"') < html.indexOf('id="reviews"'));
  assert(html.indexOf('id="reviews"') < html.indexOf('id="concerns"'));
  assert(html.indexOf('id="concerns"') < html.indexOf('id="greeting"'));
  cmd('git',['diff','origin/main','HEAD','--','css/reviews.css','js/reviews.js']);
  pass('mainとの差分は口コミUI/CSS背景・セクション順・過去ログのみ。セクション本文とそれ以外のHTMLは同一。');
  for (const name of fs.readdirSync('js').filter(x=>x.endsWith('.js'))) cmd('node',['--check','js/'+name]);
  cmd('git',['diff','--check','origin/main','HEAD']);
  cmd('git',['diff','--check']);
  pass('全JS構文とgit diff --check正常。');
  class Element {
    constructor(tag) { this.tag=tag; this.children=[]; this.attributes={}; this.textContent=''; this.removed=false; }
    append(...nodes) { this.children.push(...nodes); }
    setAttribute(k,v) { this.attributes[k]=v; }
    replaceChildren(...nodes) { this.children=nodes; }
    remove() { this.removed=true; }
  }
  const dataCode=fs.readFileSync('js/reviews-data.js','utf8');
  const renderer=fs.readFileSync('js/reviews.js','utf8');
  function setup() {
    const nodes=Object.fromEntries(['reviews-grid','reviews-intro','reviews-note'].map(id=>{assert(html.includes('id="'+id+'"'));return [id,new Element('div')];}));
    const context=vm.createContext({window:{},URL,document:{getElementById:id=>nodes[id]||null,createElement:tag=>new Element(tag)}});
    vm.runInContext(dataCode,context);
    return {nodes,context};
  }
  assert(html.indexOf('src="js/reviews-data.js" defer')<html.indexOf('src="js/reviews.js" defer'));
  const {nodes,context}=setup();
  vm.runInContext(renderer,context);
  assert.equal(nodes['reviews-grid'].children.length,3);
  const flat=node=>[node,...node.children.flatMap(flat)];
  nodes['reviews-grid'].children.forEach((card,i)=>{
    const source=context.window.nakamuraReviews[i];
    assert.equal(card.children[0].className,'review-body');
    assert.equal(card.children[0].textContent,source.text);
    const author=card.children[1];
    assert.equal(author.className,'review-author');
    assert.equal(author.children[0].children[0].textContent,'★★★★★');
    assert.equal(author.children[0].attributes['aria-label'],'5点満点中5点');
    assert.equal(author.children[1].textContent,source.author);
    const all=flat(card);
    assert(!all.some(n=>n.tag==='a'||n.className==='review-avatar'||n.className==='review-source'));
    assert(!all.some(n=>n.textContent==='声'||n.textContent.includes('5点満点')));
  });
  assert(nodes['reviews-intro'].removed && nodes['reviews-note'].removed);
  pass('データ→DOM: 3カードで本文→星→属性の順、本文/属性を欠損なく維持。声アバター・可視点数・紹介文・出典注記・リンクなし。読み上げ点数は維持。');
  const empty=setup();empty.context.window.nakamuraReviews=[];vm.runInContext(renderer,empty.context);
  assert(!empty.nodes['reviews-intro'].removed&&!empty.nodes['reviews-note'].removed);
  const invalid=setup();invalid.context.window.nakamuraReviews=[{author:'test',text:'test',rating:0,verified:true,sourceUrl:'https://nakamuraseitai.jp/#voice'},{author:'test',text:'test',rating:5,verified:true,sourceUrl:'https://invalid.example/'}];vm.runInContext(renderer,invalid.context);
  assert.equal(invalid.nodes['reviews-grid'].children.length,0);
  assert(!invalid.nodes['reviews-note'].removed);
  pass('0件・不正点数・許可外URLで例外なし、準備中表示を維持。');
  lines.push('', '総合: PASS', '', '制限: DOMスタブはブラウザ描画・レスポンシブ配置を検証しない。ブラウザ再操作は依頼に従い未実施。mainはローカルorigin/mainを比較基準とした。');
} catch (error) { lines.push('総合: FAIL',String(error.stack));console.error(error);process.exitCode=1; }
lines.push('', '再現コマンド: `node logs/11/integration-check.cjs`。上記PASS行は同コマンドの実際の標準出力。');
fs.writeFileSync('logs/11/integration-test.md',lines.join('\n')+'\n');
