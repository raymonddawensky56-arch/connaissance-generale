import { useMemo, useState } from "react";
import { BookOpen, Globe2, Heart, Home, Moon, Sun, BarChart3, Settings, Shuffle, ArrowLeft, CheckCircle2, CircleHelp } from "lucide-react";
import { categories } from "./data/categories";
import { demoQuestions } from "./data/demoQuestions";
import { languages, t, isRTL } from "./i18n";
import type { Language, CategoryId, QuizQuestion } from "./types";

type Page = "home" | "category" | "quiz" | "result" | "favorites" | "stats" | "settings";
const stored = <T,>(key:string, fallback:T):T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};
export default function App() {
  const [lang,setLang] = useState<Language>(() => stored<Language>("cg-lang","fr"));
  const [dark,setDark] = useState(() => stored<boolean>("cg-dark",true));
  const [page,setPage] = useState<Page>("home");
  const [selectedCategory,setSelectedCategory] = useState<CategoryId>("capitals");
  const [quiz,setQuiz] = useState<QuizQuestion[]>([]);
  const [index,setIndex] = useState(0);
  const [choice,setChoice] = useState<string|null>(null);
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [favorites,setFavorites] = useState<string[]>(() => stored<string[]>("cg-favorites",[]));
  const [history,setHistory] = useState<number[]>(() => stored<number[]>("cg-history",[]));
  const [showExplanation,setShowExplanation] = useState(false);
  const rtl = isRTL(lang);
  const tr = (key: Parameters<typeof t>[1]) => t(lang,key);
  const current = quiz[index];
  const currentText = current?.translations[lang] ?? current?.translations.fr;
  const categoryTitle = (id:CategoryId) => categories.find(c=>c.id===id)?.title[lang] ?? "";
  const correctCount = Object.entries(answers).filter(([id,answer]) => quiz.find(q=>q.id===id)?.correctOptionId===answer).length;
  const startQuiz = (items:QuizQuestion[]) => {
    setQuiz(items); setIndex(0); setChoice(null); setAnswers({}); setShowExplanation(false); setPage("quiz");
  };
  const finish = () => {
    const score = correctCount + (current && choice===current.correctOptionId && !answers[current.id] ? 1 : 0);
    const nextHistory=[...history,score]; setHistory(nextHistory); localStorage.setItem("cg-history",JSON.stringify(nextHistory)); setPage("result");
  };
  const toggleFavorite = (id:string) => {
    const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
    setFavorites(next); localStorage.setItem("cg-favorites",JSON.stringify(next));
  };
  const beginCategory = (id:CategoryId) => {
    setSelectedCategory(id);
    const items=demoQuestions.filter(q=>q.categoryId===id);
    if(items.length) startQuiz(items);
    else setPage("category");
  };
  const beginRandom = () => startQuiz([...demoQuestions].sort(()=>Math.random()-.5));
  const submit = () => {
    if(!current || !choice) return;
    setAnswers(prev=>({...prev,[current.id]:choice})); setShowExplanation(true);
  };
  const next = () => {
    if(index+1>=quiz.length) finish();
    else { setIndex(index+1); setChoice(null); setShowExplanation(false); }
  };
  const favoriteQuestions = useMemo(()=>demoQuestions.filter(q=>favorites.includes(q.id)),[favorites]);
  const changeLang=(value:Language)=>{setLang(value);localStorage.setItem("cg-lang",JSON.stringify(value));};
  const changeTheme=()=>{setDark(v=>{localStorage.setItem("cg-dark",JSON.stringify(!v));return !v;});};
  return <div className={dark?"app dark":"app"} dir={rtl?"rtl":"ltr"}>
    <header className="topbar">
      <button className="brand" onClick={()=>setPage("home")}><span className="brand-icon">🧠</span><span>Connaissance générale</span></button>
      <div className="top-actions"><select aria-label={tr("language")} value={lang} onChange={e=>changeLang(e.target.value as Language)}>{languages.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}</select><button className="icon-btn" onClick={changeTheme} aria-label={tr("theme")}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button></div>
    </header>
    <main>
      {page==="home" && <section className="hero">
        <div className="eyebrow"><Globe2 size={15}/> {tr("demo")}</div>
        <h1>{tr("welcome")}</h1><p>{tr("subtitle")}</p>
        <button className="primary large" onClick={()=>document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})}>{tr("start")} <span>→</span></button>
        <div className="quick-grid">
          <button className="quick-card" onClick={beginRandom}><Shuffle/><b>{tr("random")}</b></button>
          <button className="quick-card" onClick={()=>setPage("favorites")}><Heart/><b>{tr("favorites")}</b></button>
          <button className="quick-card" onClick={()=>setPage("stats")}><BarChart3/><b>{tr("stats")}</b></button>
          <button className="quick-card" onClick={()=>setPage("settings")}><Settings/><b>{tr("settings")}</b></button>
        </div>
      </section>}
      {page==="home" && <section id="categories" className="section"><div className="section-head"><div><span className="eyebrow">{tr("choose")}</span><h2>{tr("categories")}</h2></div></div><div className="category-grid">{categories.map(c=><button className="category-card" key={c.id} onClick={()=>beginCategory(c.id)}><span className="category-icon">{c.icon}</span><strong>{c.title[lang]}</strong><small>{c.description[lang]}</small><span className="card-arrow">↗</span></button>)}</div></section>}
      {page==="category" && <section className="panel"><button className="back" onClick={()=>setPage("home")}><ArrowLeft size={16}/>{tr("back")}</button><div className="category-icon big">{categories.find(c=>c.id===selectedCategory)?.icon}</div><h1>{categoryTitle(selectedCategory)}</h1><p>{tr("demo")} — le contenu définitif sera ajouté progressivement.</p><div className="notice"><CircleHelp/> Aucune série définitive n'est encore intégrée dans cette catégorie.</div></section>}
      {page==="quiz" && current && currentText && <section className="quiz-panel"><button className="back" onClick={()=>setPage("home")}><ArrowLeft size={16}/>{tr("back")}</button><div className="quiz-meta"><span>{categoryTitle(current.categoryId)}</span><span>{index+1} / {quiz.length}</span></div><div className="progress"><span style={{width:`${((index+1)/quiz.length)*100}%`}}/></div><h2>{currentText.question}</h2><div className="answers">{Object.entries(currentText.options).map(([id,value])=><button key={id} disabled={showExplanation} className={`answer ${choice===id?"chosen":""} ${showExplanation&&id===current.correctOptionId?"right":""} ${showExplanation&&choice===id&&id!==current.correctOptionId?"incorrect":""}`} onClick={()=>setChoice(id)}><span>{id}</span>{value}</button>)}</div>
        {showExplanation && <div className="explanation"><CheckCircle2 size={18}/><span>{currentText.explanation}</span></div>}
        {!showExplanation?<button className="primary full" disabled={!choice} onClick={submit}>{tr("answer")}</button>:<button className="primary full" onClick={next}>{index+1===quiz.length?tr("finish"):tr("next")} →</button>}
        <button className="text-button" onClick={()=>toggleFavorite(current.id)}><Heart size={16} fill={favorites.includes(current.id)?"currentColor":"none"}/>{favorites.includes(current.id)?tr("favorites"):"Ajouter aux favoris"}</button>
      </section>}
      {page==="result" && <section className="panel result-panel"><div className="result-icon">🏆</div><span className="eyebrow">{tr("result")}</span><h1>{correctCount} / {quiz.length}</h1><p>{tr("score")}</p><button className="primary" onClick={()=>startQuiz(quiz)}>{tr("replay")}</button><button className="secondary" onClick={()=>setPage("home")}>{tr("home")}</button></section>}
      {page==="favorites" && <section className="panel"><button className="back" onClick={()=>setPage("home")}><ArrowLeft size={16}/>{tr("back")}</button><h1>{tr("favorites")}</h1>{favoriteQuestions.length===0?<p>{tr("noFavorites")}</p>:favoriteQuestions.map(q=><article className="favorite-item" key={q.id}><b>{q.translations[lang]?.question ?? q.translations.fr.question}</b><button onClick={()=>toggleFavorite(q.id)}><Heart fill="currentColor"/></button><small>{q.translations[lang]?.explanation ?? q.translations.fr.explanation}</small></article>)}</section>}
      {page==="stats" && <section className="panel"><button className="back" onClick={()=>setPage("home")}><ArrowLeft size={16}/>{tr("back")}</button><h1>{tr("stats")}</h1><div className="stat-grid"><div><strong>{history.length}</strong><span>{tr("completed")}</span></div><div><strong>{history.length?Math.round(history.reduce((a,b)=>a+b,0)/(history.length*2)*100):0}%</strong><span>{tr("accuracy")}</span></div><div><strong>{favorites.length}</strong><span>{tr("favorites")}</span></div></div><p className="muted">Les statistiques sont enregistrées sur cet appareil.</p></section>}
      {page==="settings" && <section className="panel"><button className="back" onClick={()=>setPage("home")}><ArrowLeft size={16}/>{tr("back")}</button><h1>{tr("settings")}</h1><label className="setting-row"><span>{tr("language")}</span><select value={lang} onChange={e=>changeLang(e.target.value as Language)}>{languages.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}</select></label><label className="setting-row"><span>{tr("theme")}</span><button className="secondary" onClick={changeTheme}>{dark?tr("dark"):tr("light")}</button></label><p className="muted">{tr("demo")}: seuls quelques exemples sont présents pour tester l'application.</p></section>}
    </main>
    <footer><span>© {new Date().getFullYear()} Connaissance générale</span><span>Version 1.0.0 · {tr("demo")}</span></footer>
  </div>;
}
