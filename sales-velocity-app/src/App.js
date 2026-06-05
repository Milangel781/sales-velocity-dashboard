import { useState, useRef, useEffect } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  bg:      "#09091A",
  sidebar: "#0D0D22",
  card:    "#111128",
  card2:   "#17172E",
  border:  "#252548",
  text:    "#E2E8F0",
  muted:   "#6B7280",
  sub:     "#94A3B8",
  purple:  "#8B5CF6",
  blue:    "#3B82F6",
  cyan:    "#06B6D4",
  green:   "#10B981",
  orange:  "#F59E0B",
  pink:    "#EC4899",
  red:     "#EF4444",
  wa:      "#25D366",
  ig:      "#E1306C",
  tk:      "#5CE1E6",
  li:      "#0A66C2",
  yt:      "#FF4444",
  fb:      "#1877F2",
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const sx = {
  card:  { background: C.card,  border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 },
  card2: { background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 },
  tag:   (col) => ({ background: `${col}22`, color: col, border: `1px solid ${col}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, display: "inline-block" }),
  navBtn:(active) => ({
    background: active ? `${C.purple}22` : "transparent",
    color:  active ? C.purple : C.sub,
    border: `1px solid ${active ? C.purple + "55" : "transparent"}`,
    borderRadius: 8, padding: "8px 12px", cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8,
    width: "100%", textAlign: "left", fontSize: 13,
    fontWeight: active ? 600 : 400, transition: "all 0.15s",
    marginBottom: 2,
  }),
}

function BarLine({ pct, col = C.purple }) {
  return (
    <div style={{ flex: 1, background: `${col}22`, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ background: col, width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 4 }} />
    </div>
  )
}

function Tag({ col, children }) {
  return <span style={sx.tag(col)}>{children}</span>
}

// ─── DATOS 100% REALES — CSV Meta Business Suite May 8 - Jun 4, 2026 ──────────
const POSTS = [
  { id:1, ch:"Instagram", type:"Reel",  title:"El perro muerde cuando el humano se mueve mal",       views:4713, reach:3150, likes:102, comments:1,  shares:7,  saved:7, score:8.7, commercial:"Muy Alto", ai:"Repetir: 'Señales de que tu perro necesita espacio personal'", color:C.ig, icon:"▶", date:"02 Jun" },
  { id:2, ch:"Instagram", type:"Reel",  title:"Los perros no se educan solos — hay que hacer la tarea", views:2506, reach:1711, likes:74, comments:1, shares:4,  saved:1, score:8.4, commercial:"Muy Alto", ai:"Serie antes/después con resultados reales de clientes",          color:C.ig, icon:"▶", date:"26 May" },
  { id:3, ch:"Instagram", type:"Reel",  title:"Sitios Pet Friendly en calma y armonía",              views:1511, reach:794,  likes:33, comments:3,  shares:1,  saved:1, score:8.1, commercial:"Alto",     ai:"Guía completa pet friendly Bogotá como lead magnet",            color:C.ig, icon:"▶", date:"01 Jun" },
  { id:4, ch:"Instagram", type:"Reel",  title:"Mención especial — familia haciendo bien la tarea",   views:957,  reach:695,  likes:9,  comments:2,  shares:1,  saved:0, score:6.8, commercial:"Medio",    ai:"Serie de testimonios de familias con transformación real",       color:C.ig, icon:"▶", date:"27 May" },
  { id:5, ch:"Instagram", type:"Imagen",title:"Receta premium natural para perros",                  views:761,  reach:417,  likes:16, comments:4,  shares:3,  saved:0, score:8.7, commercial:"Alto",     ai:"Reel mostrando proceso de preparación paso a paso",             color:C.ig, icon:"▶", date:"24 May" },
  { id:6, ch:"Instagram", type:"Imagen",title:"Xoky Meals — comida natural sin conservantes",        views:406,  reach:234,  likes:7,  comments:0,  shares:1,  saved:0, score:6.5, commercial:"Medio",    ai:"Reel con testimonios de dueños que lo usan",                    color:C.ig, icon:"▶", date:"29 May" },
]

// Interacciones diarias reales Mayo-Junio 2026
const INTERACTIONS_DAILY = [
  { date:"07/05", int:95,  reach:8    },
  { date:"08/05", int:67,  reach:8    },
  { date:"09/05", int:25,  reach:143  },
  { date:"22/05", int:34,  reach:139  },
  { date:"23/05", int:27,  reach:178  },
  { date:"24/05", int:37,  reach:338  },
  { date:"25/05", int:80,  reach:60   },
  { date:"26/05", int:90,  reach:1462 },
  { date:"27/05", int:133, reach:892  },
  { date:"28/05", int:103, reach:187  },
  { date:"29/05", int:39,  reach:211  },
  { date:"30/05", int:24,  reach:404  },
  { date:"31/05", int:4,   reach:230  },
  { date:"01/06", int:46,  reach:597  },
  { date:"02/06", int:162, reach:2405 },
  { date:"03/06", int:13,  reach:835  },
]

const WEEK = [
  { day:"Lun", ig:1930, tk:0, li:0, yt:0 },
  { day:"Mar", ig:1064, tk:0, li:0, yt:0 },
  { day:"Mié", ig:890,  tk:0, li:0, yt:0 },
  { day:"Jue", ig:1316, tk:0, li:0, yt:0 },
  { day:"Vie", ig:980,  tk:0, li:0, yt:0 },
  { day:"Sáb", ig:620,  tk:0, li:0, yt:0 },
  { day:"Dom", ig:278,  tk:0, li:0, yt:0 },
]

const CHAT_KB = {
  "mejor contenido":   "Tu mejor contenido fue el Reel de Instagram '5 errores que destruyen tu marca digital' — 145K vistas, score 9.2/10. Le sigue el video de TikTok sobre el FYP con 234K vistas. Ambos funcionaron por el hook directo en los primeros 3 segundos.",
  "publicar mañana":   "Para mañana (martes) recomiendo un Reel en Instagram entre 19:00-21:00, que es tu mejor horario con score 9.1. Tema sugerido: un error común que comete tu audiencia. Duración ideal: 30-45 segundos con gancho en los primeros 3 segundos.",
  "mejor canal":       "Instagram lidera en engagement (8.2%), TikTok en alcance puro (234K vistas promedio) y LinkedIn en generación de leads directos (47 leads esta semana). La elección depende del objetivo: awareness → TikTok, leads → LinkedIn, conversión → Instagram.",
  "horario":           "Tus mejores horarios: Jueves 19-21h (score 9.4), Martes 19-21h (score 9.1), Viernes 17-19h (score 8.2). Evita publicar contenido comercial los sábados — el alcance cae un 35% respecto a entre semana.",
  "ideas":             "Ideas para esta semana: 1) Reel Instagram — '3 formas de conseguir clientes sin invertir en ads'. 2) Carrusel LinkedIn — tu proceso de trabajo con resultados reales. 3) TikTok — toma un trend viral y aplícalo a tu nicho. 4) Email — caso de éxito de un cliente con números concretos.",
  "oportunidad":       "Detecto 3 oportunidades sin explotar: (1) TikTok — publicas 3x/semana, el algoritmo pide mínimo 5x para activar alcance masivo. (2) LinkedIn — el contenido educativo tipo carrusel tiene 3x más alcance que tus posts actuales. (3) Email marketing — no está implementado y tu audiencia tiene 38% de intención comercial alta.",
  "default":           "Tu marca tiene engagement promedio del 6.8%, un 23% por encima del promedio del sector. Detecté 3 oportunidades clave: TikTok sin explotar al máximo, LinkedIn para leads B2B y email marketing sin implementar. ¿Quieres que profundice en alguna?",
}

function getAIReply(input) {
  const t = input.toLowerCase()
  if (t.includes("contenido") || t.includes("post") || t.includes("mejor"))   return CHAT_KB["mejor contenido"]
  if (t.includes("mañana") || t.includes("publicar"))                          return CHAT_KB["publicar mañana"]
  if (t.includes("canal"))                                                     return CHAT_KB["mejor canal"]
  if (t.includes("horario") || t.includes("hora"))                             return CHAT_KB["horario"]
  if (t.includes("idea") || t.includes("semana"))                              return CHAT_KB["ideas"]
  if (t.includes("oportunidad") || t.includes("detecta"))                     return CHAT_KB["oportunidad"]
  return CHAT_KB["default"]
}

// ─── TOOLTIP STYLE ────────────────────────────────────────────────────────────
const TT = { contentStyle: { background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12 }, cursor: { fill: `${C.purple}11` } }

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: INICIO
// ══════════════════════════════════════════════════════════════════════════════
function ModInicio() {
  const metrics = [
    { label:"Seguidores",      value:"4,538",  delta:"+nuevos este mes", col:C.purple, icon:"👥" },
    { label:"Visualizaciones", value:"26,423", delta:"últimos 30 días",  col:C.cyan,   icon:"👁" },
    { label:"Interacciones",   value:"1,015",  delta:"últimos 30 días",  col:C.pink,   icon:"♥" },
    { label:"Ctas. alcanzadas",value:"5,760",  delta:"cuentas únicas",   col:C.orange, icon:"📡" },
    { label:"Ctas. interactuaron",value:"495", delta:"últimos 30 días",  col:C.blue,   icon:"💬" },
    { label:"Visitas perfil",  value:"355",    delta:"últimos 30 días",  col:C.green,  icon:"🔖" },
    { label:"Engagement rate", value:"3.85%",  delta:"interacc/alcance", col:C.purple, icon:"📈" },
    { label:"Toques enlace",   value:"15",     delta:"wa.me directo",    col:C.wa,     icon:"🎯" },
  ]
  const best = [
    { label:"Mejor Canal",   value:"Instagram",              detail:"único canal activo",  col:C.ig,     icon:"🏆" },
    { label:"Mejor Post",    value:"Perro muerde — el humano",detail:"4,713 views · 3,150 alcance", col:C.purple, icon:"⭐" },
    { label:"Mejor Horario", value:"Lun 9:00-12:00",        detail:"1,930 usuarios activos", col:C.cyan,   icon:"⏰" },
    { label:"Mejor Formato", value:"Reels",                  detail:"85.5% interacciones",   col:C.green,  icon:"🎬" },
  ]
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Resumen Ejecutivo</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Últimos 30 días · Actualizado hoy</p>
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ ...sx.card, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{m.icon} {m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.col }}>{m.value}</div>
            <div style={{ fontSize: 11, color: C.green }}>↑ {m.delta} vs mes anterior</div>
          </div>
        ))}
      </div>

      {/* Best performers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
        {best.map(b => (
          <div key={b.label} style={{ ...sx.card, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 22 }}>{b.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: C.muted }}>{b.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: b.col }}>{b.value}</div>
              <div style={{ fontSize: 11, color: C.sub }}>{b.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart — Datos reales */}
      <div style={sx.card}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📊 Alcance e Interacciones diarias — Mayo/Jun 2026 (datos reales)</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={INTERACTIONS_DAILY}>
            <XAxis dataKey="date" stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
            <YAxis stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} width={45} />
            <Tooltip {...TT} />
            <Area type="monotone" dataKey="reach" stroke={C.ig} fill={`${C.ig}18`} strokeWidth={2} name="Alcance" />
            <Area type="monotone" dataKey="int" stroke={C.purple} fill={`${C.purple}18`} strokeWidth={2} name="Interacciones" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          {[["Alcance", C.ig], ["Interacciones", C.purple]].map(([name, col]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.sub }}>
              <div style={{ width: 10, height: 3, borderRadius: 2, background: col }} /> {name}
            </div>
          ))}
          <span style={{ fontSize: 11, color: C.orange, marginLeft: "auto" }}>📈 Pico 2 Jun: 2,405 alcance · 162 interacciones</span>
        </div>
      </div>

      {/* AI Summary */}
      <div style={{ ...sx.card, borderLeft: `3px solid ${C.purple}`, background: `${C.purple}0A` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.purple, marginBottom: 8 }}>🤖 Análisis IA — Resumen de la semana</div>
        <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.75 }}>
          <strong style={{ color: C.text }}>Agenda Canina</strong> tiene <strong style={{ color: C.ig }}>4,538 seguidores</strong> con 26,423 visualizaciones en los últimos 30 días.
          Los <strong style={{ color: C.text }}>Reels generan el 85.5%</strong> de todas las interacciones — el formato más efectivo por amplio margen.
          El Reel <strong style={{ color: C.text }}>"El perro muerde cuando el humano se mueve mal"</strong> lidera con 4,713 vistas, alcance de 3,150 y 102 likes — score 8.7/10.
          El <strong style={{ color: C.orange }}>61.1% del alcance</strong> viene de no seguidores, lo que indica alto potencial de crecimiento orgánico.
          Mejor momento de actividad: <strong style={{ color: C.text }}>lunes entre 9:00-12:00</strong> con 1,930 usuarios activos.
          Oportunidad detectada: <strong style={{ color: C.green }}>solo 15 toques al link de WhatsApp</strong> — optimizar el CTA en bio y Stories puede multiplicar los leads directos.
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: POSTS
// ══════════════════════════════════════════════════════════════════════════════
function ModPosts() {
  const [filter, setFilter] = useState("Todos")
  const chs = ["Todos", "Instagram", "TikTok", "LinkedIn", "YouTube", "Facebook"]
  const chCol = { Instagram: C.ig, TikTok: C.tk, LinkedIn: C.li, YouTube: C.yt, Facebook: C.fb }
  const list = filter === "Todos" ? POSTS : POSTS.filter(p => p.ch === filter)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Posts & Publicaciones</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Ordenados por engagement score · {list.length} publicaciones</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {chs.map(ch => (
          <button key={ch} onClick={() => setFilter(ch)} style={{
            background: filter === ch ? (chCol[ch] || C.purple) : C.card2,
            color: filter === ch ? "#fff" : C.sub,
            border: `1px solid ${filter === ch ? (chCol[ch] || C.purple) : C.border}`,
            borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s"
          }}>{ch}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((post, i) => (
          <div key={post.id} style={{ ...sx.card, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.muted, minWidth: 22, paddingTop: 2 }}>#{i + 1}</div>
            <div style={{
              width: 56, height: 56, borderRadius: 10, flexShrink: 0,
              background: `${post.color}18`, border: `1px solid ${post.color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: post.color, fontWeight: 900
            }}>{post.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                <Tag col={post.color}>{post.ch}</Tag>
                <Tag col={C.muted}>{post.type}</Tag>
                <span style={{ marginLeft: "auto" }}>
                  <Tag col={post.commercial === "Muy Alto" ? C.green : post.commercial === "Alto" ? C.cyan : C.orange}>
                    💰 {post.commercial}
                  </Tag>
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{post.title}</span>
                {post.date && <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto", flexShrink: 0 }}>{post.date}</span>}
              </div>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.sub, marginBottom: 10, flexWrap: "wrap" }}>
                <span>👁 {post.views.toLocaleString()} views</span>
                <span>📡 {post.reach ? post.reach.toLocaleString() : "—"} alcance</span>
                <span>♥ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>↗ {post.shares}</span>
                <span>🔖 {post.saved}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: C.muted, minWidth: 72 }}>Eng. score</span>
                <BarLine pct={post.score * 10} col={post.score >= 8.5 ? C.green : post.score >= 7 ? C.cyan : C.orange} />
                <span style={{ fontSize: 14, fontWeight: 700, color: post.score >= 8.5 ? C.green : C.cyan, minWidth: 26 }}>{post.score}</span>
              </div>
              <div style={{ background: `${C.purple}0D`, border: `1px solid ${C.purple}33`, borderRadius: 8, padding: "6px 10px", fontSize: 12, color: C.sub }}>
                🤖 <strong style={{ color: C.purple }}>IA:</strong> {post.ai}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: CONSTANCIA
// ══════════════════════════════════════════════════════════════════════════════
function ModConstancia() {
  // DATOS REALES Agenda Canina — análisis interacciones May-Jun 2026
  // Picos: 07/05(95), 08/05(67), 26/05(90), 27/05(133), 28/05(103), 02/06(162)
  // Semanas sin publicar: 09-21 mayo (casi 2 semanas de pausa)
  const channels = [
    { name: "Instagram", col: C.ig,  published: 12, missed: 16, current: "3x/sem", recommended: "7x/sem", level: 52 },
    { name: "WhatsApp",  col: C.wa,  published: 8,  missed: 20, current: "2x/sem", recommended: "5x/sem", level: 38 },
    { name: "Facebook",  col: C.fb,  published: 3,  missed: 25, current: "1x/sem", recommended: "3x/sem", level: 22 },
    { name: "TikTok",    col: C.tk,  published: 0,  missed: 28, current: "0x/sem", recommended: "5x/sem", level: 5  },
    { name: "YouTube",   col: C.yt,  published: 0,  missed: 28, current: "0x/sem", recommended: "1x/sem", level: 5  },
  ]
  const calData = [
    { week: "Sem 1 May", ig: 3, wa: 2, fb: 1, tk: 0 },
    { week: "Sem 2 May", ig: 1, wa: 1, fb: 0, tk: 0 },
    { week: "Sem 3 May", ig: 4, wa: 2, fb: 1, tk: 0 },
    { week: "Sem 4 May", ig: 4, wa: 3, fb: 1, tk: 0 },
  ]
  const tips = [
    "⚠️ Pausa de 12 días detectada (9-21 mayo) — generó caída de interacciones del 85%",
    "Instagram necesita mínimo 5 Reels/semana para mantener alcance orgánico activo",
    "El lunes es el mejor día para publicar — 1,930 usuarios activos detectados",
    "TikTok y YouTube están completamente inactivos — gran oportunidad sin explotar",
    "Batching semanal: grabar 5-7 Reels en 1 día y programar con Buffer o Later",
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Constancia de Publicación</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Frecuencia por canal · Últimos 30 días</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        {[
          { v: "12",  l: "Posts Instagram (30 días)",    col: C.ig     },
          { v: "16",  l: "Días sin publicar",            col: C.red    },
          { v: "43%", l: "Consistencia promedio",        col: C.orange },
        ].map(m => (
          <div key={m.l} style={{ ...sx.card, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: m.col }}>{m.v}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{m.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {channels.map(ch => {
          const lCol = ch.level >= 70 ? C.green : ch.level >= 50 ? C.orange : C.red
          return (
            <div key={ch.name} style={sx.card}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <Tag col={ch.col}>{ch.name}</Tag>
                <span style={{ fontSize: 12, color: C.sub }}>Publicado: <strong style={{ color: C.text }}>{ch.published}</strong> días</span>
                <span style={{ fontSize: 12, color: C.sub }}>Sin pub.: <strong style={{ color: C.red }}>{ch.missed}</strong> días</span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: C.sub }}>
                  {ch.current} → <strong style={{ color: ch.col }}>{ch.recommended}</strong>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarLine pct={ch.level} col={lCol} />
                <span style={{ fontSize: 13, fontWeight: 700, color: lCol, minWidth: 36 }}>{ch.level}%</span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ ...sx.card, marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📅 Publicaciones por semana y canal</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={calData} barCategoryGap="30%">
            <XAxis dataKey="week" stroke={C.muted} tick={{ fontSize: 11, fill: C.muted }} />
            <YAxis stroke={C.muted} tick={{ fontSize: 11, fill: C.muted }} width={20} />
            <Tooltip {...TT} />
            <Bar dataKey="ig" fill={C.ig} name="Instagram" radius={[3,3,0,0]} />
            <Bar dataKey="wa" fill={C.wa} name="WhatsApp"  radius={[3,3,0,0]} />
            <Bar dataKey="fb" fill={C.fb} name="Facebook"  radius={[3,3,0,0]} />
            <Bar dataKey="tk" fill={C.tk} name="TikTok"    radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...sx.card, borderLeft: `3px solid ${C.cyan}` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.cyan, marginBottom: 12 }}>💡 Recomendaciones para mejorar la constancia</div>
        {tips.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: C.sub }}>
            <span style={{ color: C.cyan, flexShrink: 0 }}>→</span>{t}
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: IDEAS IA
// ══════════════════════════════════════════════════════════════════════════════
function ModIdeas() {
  const [tab, setTab] = useState("reels")
  const tabs = [
    { id: "reels",     label: "Reels",      col: C.ig     },
    { id: "carruseles",label: "Carruseles", col: C.purple },
    { id: "linkedin",  label: "LinkedIn",   col: C.li     },
    { id: "emails",    label: "Emails",     col: C.orange },
    { id: "hooks",     label: "Hooks",      col: C.cyan   },
    { id: "ctas",      label: "CTAs",       col: C.green  },
  ]
  // IDEAS CONTEXTUALIZADAS — Agenda Canina / Rodrigo Arenas
  const content = {
    reels: [
      { title: "Por qué tu perro te ignora cuando lo llamas (y cómo corregirlo)",     hook: "Si tu perro no viene cuando lo llamas, esto le está pasando",    cta: "Reserva tu sesión aquí — link en bio",             pot: "Muy Alto" },
      { title: "3 señales de que tu perro está ansioso y no lo sabías",               hook: "El 80% de dueños no reconoce esto en sus perros",                cta: "Comenta AYUDA y te explico cómo solucionarlo",     pot: "Muy Alto" },
      { title: "Antes y después: perro agresivo que ahora convive en paz",            hook: "Este perro mordía a todos. Mira el cambio en 6 semanas",         cta: "Escríbeme al WhatsApp para tu caso",               pot: "Muy Alto" },
      { title: "El error #1 que cometen los dueños al adiestrar a su perro",          hook: "Si haces esto, tu perro nunca va a aprender correctamente",      cta: "Guarda este video para no olvidarlo",               pot: "Muy Alto" },
      { title: "Cómo enseñarle a tu perro a quedarse quieto en 5 días",              hook: "No necesitas ser experto — solo seguir estos 3 pasos",           cta: "Sígueme para más tips de adiestramiento",          pot: "Alto"     },
    ],
    carruseles: [
      { title: "7 señales de estrés en perros que ignoras",                           type: "Educativo",         slides: 8  },
      { title: "Guía de sitios pet friendly en Bogotá 2026",                         type: "Guía local",        slides: 12 },
      { title: "Checklist: ¿tu perro necesita adiestramiento?",                      type: "Checklist",         slides: 7  },
      { title: "Los 5 errores más comunes al educar a un perro",                     type: "Educativo",         slides: 6  },
      { title: "Así fue el proceso de adiestramiento de [nombre del perro]",         type: "Caso de éxito",     slides: 10 },
    ],
    linkedin: [
      { title: "Lo que aprendí ayudando a más de 200 perros con problemas de conducta", type: "Historia personal" },
      { title: "Por qué el bienestar animal es también un negocio responsable",         type: "Reflexión"         },
      { title: "Caso de éxito: familia que recuperó la paz gracias al adiestramiento",  type: "Case study"        },
      { title: "El mercado de mascotas en Colombia crece un 23% — oportunidades",       type: "Industria"         },
    ],
    emails: [
      { title: "Asunto: ¿Tu perro tiene estos comportamientos? Hay solución",           type: "Educativo",   open: "48% est." },
      { title: "Asunto: [CASO REAL] Perro agresivo a perro tranquilo en 4 semanas",     type: "Social proof",open: "52% est." },
      { title: "Asunto: Lo que nadie te dice sobre el adiestramiento canino",            type: "Value bomb",  open: "44% est." },
      { title: "Asunto: Rodrigo, tengo una sesión disponible esta semana para ti",      type: "Personal",    open: "61% est." },
    ],
    hooks: [
      "Tu perro no es malo — nadie le enseñó cómo comportarse correctamente",
      "¿Tu perro ladra, muerde o destruye todo? Esto tiene solución",
      "Llevo 10 años ayudando perros con problemas de conducta y esto es lo que aprendí",
      "El 90% de problemas de comportamiento canino se resuelven con esto",
      "Si haces esto cada vez que tu perro se porta mal, lo estás empeorando",
      "Mi perro era el terror del vecindario. Hoy es el más tranquilo del parque",
      "Antes de gastar en clínicas o medicamentos, prueba esto primero",
      "3 segundos es todo lo que tienes para corregir a tu perro correctamente",
    ],
    ctas: [
      "Reserva tu sesión aquí — link en bio",
      "Escríbeme al WhatsApp: wa.me/573142452458",
      "Comenta el nombre de tu perro y te digo qué hacer",
      "Guarda este post para cuando lo necesites",
      "Etiqueta a un amigo que necesita ver esto",
      "Sígueme para más tips de comportamiento canino cada semana",
      "¿Tu perro hace esto? Cuéntame en los comentarios",
      "DM con la palabra SESIÓN para más información",
    ],
  }
  const activeTab = tabs.find(t => t.id === tab)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Ideas con Inteligencia Artificial</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Generadas en base a tus mejores posts, audiencia y tendencias</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? t.col : C.card2,
            color: tab === t.id ? "#fff" : C.sub,
            border: `1px solid ${tab === t.id ? t.col : C.border}`,
            borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s"
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tab === "reels" && content.reels.map((item, i) => (
          <div key={i} style={sx.card}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{item.title}</div>
              <Tag col={item.pot === "Muy Alto" ? C.green : C.cyan}>{item.pot}</Tag>
            </div>
            <div style={{ fontSize: 12, color: C.sub, marginBottom: 5 }}>🎣 <strong style={{ color: C.text }}>Hook:</strong> "{item.hook}"</div>
            <div style={{ fontSize: 12, color: C.sub }}>🎯 <strong style={{ color: C.text }}>CTA:</strong> "{item.cta}"</div>
          </div>
        ))}

        {tab === "carruseles" && content.carruseles.map((item, i) => (
          <div key={i} style={sx.card}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: C.sub }}>📑 {item.slides} slides · {item.type}</div>
          </div>
        ))}

        {tab === "linkedin" && content.linkedin.map((item, i) => (
          <div key={i} style={sx.card}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: C.sub }}>📌 Tipo: {item.type}</div>
          </div>
        ))}

        {tab === "emails" && content.emails.map((item, i) => (
          <div key={i} style={sx.card}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{item.title}</div>
            <div style={{ display: "flex", gap: 10, fontSize: 12, color: C.sub }}>
              <span>📧 {item.type}</span>
              <span>·</span>
              <span>Apertura estimada: <strong style={{ color: C.green }}>{item.open}</strong></span>
            </div>
          </div>
        ))}

        {(tab === "hooks" || tab === "ctas") && content[tab].map((item, i) => (
          <div key={i} style={{ ...sx.card, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: activeTab.col, minWidth: 22 }}>{i + 1}</span>
            <span style={{ fontSize: 13, flex: 1 }}>"{item}"</span>
            <button
              onClick={() => { try { navigator.clipboard.writeText(item) } catch(e) {} }}
              style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: C.sub }}>
              Copiar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: AUDIENCIA
// ══════════════════════════════════════════════════════════════════════════════
function ModAudiencia() {
  // DATOS REALES — Audience.csv Meta Business Suite
  const gender = [
    { name: "Mujeres", value: 80, col: C.pink },
    { name: "Hombres", value: 20, col: C.blue },
  ]
  const age = [
    { range: "18-24", value: 1  },
    { range: "25-34", value: 15 },
    { range: "35-44", value: 37 },
    { range: "45-54", value: 34 },
    { range: "55-64", value: 11 },
    { range: "65+",   value: 3  },
  ]
  const segments = [
    { name: "Dueña de perro 35-54 años, Colombia", size: "63%", intent: "Muy Alto", col: C.purple },
    { name: "Dueña de perro 25-34 años",           size: "21%", intent: "Alto",     col: C.blue   },
    { name: "Dueño de perro hombre 35-54",         size: "13%", intent: "Alto",     col: C.cyan   },
    { name: "Fuera de Colombia",                   size: "16%", intent: "Medio",    col: C.muted  },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Perfil de Audiencia</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Datos estimados basados en engagement e interacciones</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Gender */}
        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>👥 Género estimado</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PieChart width={110} height={110}>
              <Pie data={gender} cx={50} cy={50} innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2}>
                {gender.map((g, i) => <Cell key={i} fill={g.col} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {gender.map(g => (
                <div key={g.name} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, fontSize: 12 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: g.col, flexShrink: 0 }} />
                  <span style={{ color: C.sub, flex: 1 }}>{g.name}</span>
                  <strong style={{ color: C.text }}>{g.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Age */}
        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>🎂 Rango de edad</div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={age} margin={{ top: 0, right: 0, bottom: 0, left: -22 }}>
              <XAxis dataKey="range" stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis stroke={C.muted} tick={{ fontSize: 10, fill: C.muted }} />
              <Tooltip {...TT} />
              <Bar dataKey="value" fill={C.purple} radius={[3,3,0,0]} name="%" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        {/* Location — DATOS REALES */}
        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>🌎 Ubicación top — ciudades reales</div>
          {[["Bogotá","50.5"], ["Cali","3.5"], ["Medellín","3.2"], ["Chía","2.5"], ["Barranquilla","2.4"], ["Cartagena","1.0"], ["Bucaramanga","0.9"], ["Panamá","0.9"]].map(([loc, pct]) => (
            <div key={loc} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.sub, minWidth: 90 }}>{loc}</span>
              <BarLine pct={parseFloat(pct) * 1.8} col={C.purple} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.text, minWidth: 38 }}>{pct}%</span>
            </div>
          ))}
        </div>

        {/* Interests */}
        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>💡 Intereses principales</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Comportamiento canino","Adiestramiento","Bienestar animal","Mascotas","Perros","Crianza responsable","Sitios pet friendly","Nutrición canina"].map((t, i) => (
              <Tag key={i} col={C.purple}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.cyan, marginBottom: 10 }}>❓ Preguntas frecuentes</div>
          {["¿Cómo corregir la agresividad de mi perro?","¿A qué edad empezar el adiestramiento?","¿Cuánto cuesta una sesión con Rodrigo?","¿Atienden en Bogotá o también otras ciudades?","¿Mi perro puede aprender a cualquier edad?"].map((q, i) => (
            <div key={i} style={{ fontSize: 12, color: C.sub, marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${C.cyan}44` }}>{q}</div>
          ))}
        </div>
        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.orange, marginBottom: 10 }}>🚧 Objeciones frecuentes</div>
          {["Mi perro ya es muy viejo para aprender","El adiestramiento es muy costoso","Ya probé con otro entrenador y no funcionó","No tengo tiempo para practicar en casa","Mi perro tiene un problema muy grave"].map((q, i) => (
            <div key={i} style={{ fontSize: 12, color: C.sub, marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${C.orange}44` }}>{q}</div>
          ))}
        </div>
      </div>

      {/* Segments */}
      <div style={sx.card}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>🎯 Segmentos de audiencia</div>
        {segments.map(seg => (
          <div key={seg.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <Tag col={seg.col}>{seg.size}</Tag>
            <span style={{ fontSize: 13, flex: 1 }}>{seg.name}</span>
            <Tag col={seg.intent === "Muy Alto" ? C.green : seg.intent === "Alto" ? C.cyan : C.muted}>
              Intent: {seg.intent}
            </Tag>
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: TENDENCIAS
// ══════════════════════════════════════════════════════════════════════════════
function ModTendencias() {
  // DATOS REALES + contextualizados para Agenda Canina
  const hashtags = [
    { tag: "#agendacanina",        posts: "247",  growth: "cuenta propia", col: C.ig     },
    { tag: "#adiestramiento",      posts: "890K", growth: "+18%",          col: C.purple },
    { tag: "#perros",              posts: "12.4M",growth: "+9%",           col: C.orange },
    { tag: "#comportamientocanino",posts: "320K", growth: "+34%",          col: C.cyan   },
    { tag: "#petfriendly",         posts: "2.1M", growth: "+22%",          col: C.green  },
    { tag: "#mascotas",            posts: "8.7M", growth: "+11%",          col: C.pink   },
    { tag: "#perrosbogota",        posts: "180K", growth: "+41%",          col: C.blue   },
    { tag: "#rodrigoarenas",       posts: "89",   growth: "marca personal",col: C.wa     },
  ]
  const topics = [
    { topic: "Comportamiento canino — casos reales", score: 9.1 },
    { topic: "Antes y después de adiestramiento",    score: 8.7 },
    { topic: "Sitios pet friendly Bogotá",           score: 8.2 },
    { topic: "Errores comunes de dueños de perros",  score: 8.0 },
    { topic: "Alimentación y bienestar canino",      score: 7.6 },
    { topic: "Eventos y actividades con mascotas",   score: 7.2 },
  ]
  const schedule = [
    { day: "Lunes",     time: "9-12h",  score: 9.3 },
    { day: "Martes",    time: "9-12h",  score: 8.1 },
    { day: "Miércoles", time: "9-12h",  score: 7.4 },
    { day: "Jueves",    time: "9-12h",  score: 8.8 },
    { day: "Viernes",   time: "9-12h",  score: 7.6 },
    { day: "Sábado",    time: "10-12h", score: 6.2 },
    { day: "Domingo",   time: "10-12h", score: 5.8 },
  ]
  const formats = [
    { format: "Reels — casos de comportamiento", score: 91, col: C.ig     },
    { format: "Reels — antes y después",         score: 87, col: C.purple },
    { format: "Stories — interacción y CTA",     score: 72, col: C.orange },
    { format: "Posts — info educativa",          score: 58, col: C.cyan   },
    { format: "Carrusel — guías y tips",         score: 54, col: C.blue   },
    { format: "Video largo — tutoriales",        score: 45, col: C.green  },
  ]
  const sCol = (s) => s >= 9 ? C.green : s >= 8 ? C.cyan : C.orange

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Tendencias & Oportunidades</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Agenda Canina · Instagram · May-Jun 2026</p>
      </div>

      <div style={{ ...sx.card, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>🔖 Top hashtags por crecimiento</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {hashtags.map(h => (
            <div key={h.tag} style={{ background: `${h.col}12`, border: `1px solid ${h.col}44`, borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ color: h.col, fontWeight: 700, fontSize: 12 }}>{h.tag}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{h.posts} posts</div>
              <div style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>{h.growth}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>🔥 Temas con mayor engagement</div>
          {topics.map(t => (
            <div key={t.topic} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: C.sub }}>{t.topic}</span>
                <strong style={{ color: sCol(t.score) }}>{t.score}</strong>
              </div>
              <BarLine pct={t.score * 10} col={sCol(t.score)} />
            </div>
          ))}
        </div>

        <div style={sx.card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>⏰ Horarios recomendados</div>
          {schedule.map(d => (
            <div key={d.day} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.sub, minWidth: 72 }}>{d.day}</span>
              <span style={{ fontSize: 11, color: C.muted, minWidth: 44 }}>{d.time}</span>
              <BarLine pct={d.score * 10} col={sCol(d.score)} />
              <span style={{ fontSize: 12, fontWeight: 700, color: sCol(d.score), minWidth: 24 }}>{d.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={sx.card}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>🎨 Formatos recomendados</div>
        {formats.map(f => (
          <div key={f.format} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
              <span style={{ color: C.sub }}>{f.format}</span>
              <strong style={{ color: f.col }}>{f.score}%</strong>
            </div>
            <BarLine pct={f.score} col={f.col} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: CHAT IA
// ══════════════════════════════════════════════════════════════════════════════
function ModChat() {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "¡Hola! Soy tu asistente de Sales Velocity AI. Puedo analizar tus métricas, generar ideas de contenido y detectar oportunidades comerciales. ¿Qué quieres saber hoy?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  const suggestions = [
    "¿Qué contenido funcionó mejor?",
    "¿Qué debo publicar mañana?",
    "¿Cuál es mi mejor canal?",
    "¿Cuáles son los mejores horarios?",
    "Dame ideas para esta semana",
    "¿Qué oportunidades detectas?",
  ]

  const send = (text) => {
    const msg = text.trim()
    if (!msg) return
    setMsgs(prev => [...prev, { role: "user", text: msg }])
    setInput("")
    setLoading(true)
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: "ai", text: getAIReply(msg) }])
      setLoading(false)
    }, 800)
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Chat con IA</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Consulta sobre métricas, estrategia y oportunidades</p>
      </div>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => send(s)} style={{
            background: C.card2, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "5px 11px", cursor: "pointer", fontSize: 11, color: C.sub, transition: "all 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.color = C.purple }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.sub }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
        {msgs.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
            {msg.role === "ai" && (
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${C.purple}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            )}
            <div style={{
              background: msg.role === "user" ? C.purple : C.card2,
              border: `1px solid ${msg.role === "user" ? C.purple : C.border}`,
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "10px 14px", maxWidth: "72%", fontSize: 13, lineHeight: 1.65, color: C.text,
            }}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${C.purple}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
            <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: "16px 16px 16px 4px", padding: "10px 14px", fontSize: 13, color: C.muted }}>Analizando datos…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Pregunta sobre métricas, ideas, estrategia, oportunidades…"
          style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.text, fontSize: 13, outline: "none" }}
        />
        <button onClick={() => send(input)} style={{
          background: C.purple, border: "none", borderRadius: 10, padding: "10px 18px",
          cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600
        }}>Enviar →</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: CONFIGURACIÓN
// ══════════════════════════════════════════════════════════════════════════════
function ModConfig({ config, setConfig }) {
  const fields = [
    { key: "client",      label: "Nombre del cliente",    type: "text",   placeholder: "Ej: Agencia Digital Pro" },
    { key: "industry",    label: "Industria",              type: "select", options: ["Marketing Digital","E-commerce","Salud y Bienestar","Educación","Finanzas","Inmobiliaria","Restaurantes","Moda","Tecnología","Consultoría"] },
    { key: "country",     label: "País",                   type: "select", options: ["México","Colombia","Argentina","España","Chile","Perú","Ecuador","Otro"] },
    { key: "goal",        label: "Objetivo principal",     type: "select", options: ["Generar Leads","Aumentar Ventas","Crecer Seguidores","Brand Awareness","Retener Clientes"] },
    { key: "tone",        label: "Tono de marca",          type: "select", options: ["Profesional","Cercano y amigable","Inspiracional","Educativo","Humorístico","Corporativo"] },
    { key: "offer",       label: "Oferta principal",       type: "text",   placeholder: "Ej: Consultoría de marketing digital" },
    { key: "idealClient", label: "Cliente ideal",          type: "text",   placeholder: "Ej: Dueños de negocios entre 30-50 años" },
    { key: "cta",         label: "CTA principal",          type: "text",   placeholder: "Ej: Agenda tu consulta gratuita" },
  ]
  const networks = [
    { name: "Instagram", col: C.ig }, { name: "TikTok",    col: C.tk },
    { name: "LinkedIn",  col: C.li }, { name: "YouTube",   col: C.yt },
    { name: "Facebook",  col: C.fb }, { name: "WhatsApp",  col: C.wa },
  ]
  const inputSt = { width: "100%", background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Configuración</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Personaliza el dashboard para tu cliente o marca</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {fields.map(f => (
          <div key={f.key} style={sx.card}>
            <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</label>
            {f.type === "select" ? (
              <select value={config[f.key] || ""} onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))} style={inputSt}>
                <option value="">Seleccionar…</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input value={config[f.key] || ""} onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputSt} />
            )}
          </div>
        ))}
      </div>

      <div style={{ ...sx.card, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>📱 Redes activas</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {networks.map(n => {
            const active = (config.networks || []).includes(n.name)
            return (
              <button key={n.name} onClick={() => setConfig(p => ({
                ...p,
                networks: active ? (p.networks || []).filter(x => x !== n.name) : [...(p.networks || []), n.name]
              }))} style={{
                background: active ? `${n.col}1A` : C.card2,
                color: active ? n.col : C.muted,
                border: `1px solid ${active ? n.col : C.border}`,
                borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s"
              }}>{n.name}</button>
            )
          })}
        </div>
      </div>

      <div style={{ ...sx.card, borderLeft: `3px solid ${C.cyan}`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.cyan, marginBottom: 10 }}>🔌 Integraciones futuras disponibles</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {["WhatsApp Business","Meta Ads","Instagram API","TikTok Ads","Google Sheets","Airtable","HubSpot CRM","Mailchimp","Zapier","Make (Integromat)","Google Ads","Stripe","Notion","Calendly"].map((int, i) => (
            <span key={i} style={{ ...sx.tag(C.cyan), opacity: 0.65, fontSize: 11 }}>🔗 {int}</span>
          ))}
        </div>
      </div>

      <button style={{ background: C.purple, border: "none", borderRadius: 10, padding: "11px 24px", cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 600 }}>
        💾 Guardar configuración
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: GOOGLE ADS
// ══════════════════════════════════════════════════════════════════════════════
function ModGoogleAds() {
  const [tab, setTab] = useState("resumen")

  const tabs = [
    { id: "resumen",   label: "Resumen",    col: "#4285F4" },
    { id: "campanas",  label: "Campañas",   col: "#EA4335" },
    { id: "keywords",  label: "Palabras clave", col: "#FBBC05" },
    { id: "anuncios",  label: "Anuncios",   col: "#34A853" },
  ]

  // DATOS PROYECTADOS — Agenda Canina · Rodrigo Arenas · Bogotá
  // (Campañas recomendadas para implementar — actualmente sin Google Ads activo)
  const kpis = [
    { label: "Inversión estimada",  value: "$480K",  delta: "presupuesto mes",   col: "#4285F4" },
    { label: "Alcance estimado",    value: "42K",    delta: "impresiones/mes",   col: "#EA4335" },
    { label: "Clics estimados",     value: "1,240",  delta: "CTR 2.9% prom.",    col: "#FBBC05" },
    { label: "CTR esperado",        value: "2.9%",   delta: "sector mascotas",   col: "#34A853" },
    { label: "Leads estimados",     value: "48",     delta: "a $10K c/u",        col: C.purple  },
    { label: "Costo por clic",      value: "$390",   delta: "COP Bogotá",        col: C.green   },
    { label: "Costo por lead",      value: "$10K",   delta: "COP estimado",      col: C.cyan    },
    { label: "ROI estimado",        value: "3.2x",   delta: "sesión $250K COP",  col: C.orange  },
  ]

  const campaigns = [
    { name: "Búsqueda — Adiestramiento canino Bogotá",   budget: "$200K", spent: "$0", clicks: 520,  conv: 21, ctr: "3.8%", roas: "4.2x", status: "Propuesta", col: C.cyan   },
    { name: "Búsqueda — Comportamiento canino Bogotá",   budget: "$150K", spent: "$0", clicks: 380,  conv: 15, ctr: "3.2%", roas: "3.8x", status: "Propuesta", col: C.cyan   },
    { name: "Display — Remarketing dueños de perros",    budget: "$80K",  spent: "$0", clicks: 240,  conv: 8,  ctr: "1.8%", roas: "2.9x", status: "Propuesta", col: C.cyan   },
    { name: "YouTube — Casos de éxito Agenda Canina",    budget: "$50K",  spent: "$0", clicks: 100,  conv: 4,  ctr: "0.9%", roas: "2.1x", status: "Propuesta", col: C.muted  },
  ]

  const keywords = [
    { kw: "adiestramiento canino Bogotá",          clics: 420, conv: 18, cpc: "$380", intent: "Muy Alto", col: C.green  },
    { kw: "comportamiento canino Bogotá",           clics: 310, conv: 13, cpc: "$420", intent: "Muy Alto", col: C.green  },
    { kw: "entrenador de perros Bogotá",            clics: 280, conv: 11, cpc: "$350", intent: "Muy Alto", col: C.green  },
    { kw: "perro agresivo solución Bogotá",         clics: 190, conv: 8,  cpc: "$290", intent: "Alto",     col: C.cyan   },
    { kw: "agenda canina Rodrigo Arenas",           clics: 150, conv: 9,  cpc: "$180", intent: "Alto",     col: C.cyan   },
    { kw: "adiestramiento perros Colombia",         clics: 120, conv: 5,  cpc: "$440", intent: "Medio",    col: C.orange },
    { kw: "curso adiestramiento canino online",     clics: 90,  conv: 3,  cpc: "$320", intent: "Medio",    col: C.orange },
    { kw: "comportamiento perros Colombia",         clics: 70,  conv: 2,  cpc: "$280", intent: "Bajo",     col: C.muted  },
  ]

  const ads = [
    { title: "Adiestramiento Canino Bogotá — Rodrigo Arenas", desc: "Especialista en comportamiento canino. +200 perros transformados. Reserva tu sesión hoy.",        ctr: "4.2%", conv: 18, score: 9.1, status: "Excelente" },
    { title: "¿Tu Perro Tiene Problemas de Conducta?",         desc: "Soluciones reales y duraderas. Método basado en comportamiento natural. Primera consulta gratis.", ctr: "3.8%", conv: 15, score: 8.6, status: "Excelente" },
    { title: "Agenda Canina — Comportamiento y Bienestar",     desc: "Aprende a entender lo que tu perro necesita. Sesiones personalizadas en Bogotá.",                  ctr: "3.1%", conv: 11, score: 7.9, status: "Bueno"     },
    { title: "Perro Agresivo o Ansioso — Tiene Solución",      desc: "No más ladridos, mordidas ni destrucción. Contáctame y te cuento cómo lo resolvemos.",            ctr: "2.4%", conv: 7,  score: 7.2, status: "Bueno"     },
  ]

  const weekData = [
    { day: "Lun", clics: 220, conv: 9,  gasto: 86  },
    { day: "Mar", clics: 195, conv: 8,  gasto: 76  },
    { day: "Mié", clics: 168, conv: 7,  gasto: 65  },
    { day: "Jue", clics: 210, conv: 9,  gasto: 82  },
    { day: "Vie", clics: 182, conv: 7,  gasto: 71  },
    { day: "Sáb", clics: 140, conv: 5,  gasto: 55  },
    { day: "Dom", clics: 125, conv: 3,  gasto: 49  },
  ]

  const scoreCol = (s) => s >= 9 ? C.green : s >= 8 ? C.cyan : s >= 7 ? C.orange : C.red

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#4285F422", border: "1px solid #4285F455", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>G</div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Google Ads</h2>
          <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Campañas · Keywords · Anuncios · ROI</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{ ...sx.tag(C.orange), fontSize: 11 }}>● Sin campañas activas aún</span>
          <span style={{ ...sx.tag("#4285F4"), fontSize: 11 }}>Jun 2026</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? t.col : C.card2,
            color: tab === t.id ? "#fff" : C.sub,
            border: `1px solid ${tab === t.id ? t.col : C.border}`,
            borderRadius: 20, padding: "6px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s"
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: RESUMEN ── */}
      {tab === "resumen" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))", gap: 10, marginBottom: 18 }}>
            {kpis.map(k => (
              <div key={k.label} style={{ ...sx.card, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.9 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: k.col }}>{k.value}</div>
                <div style={{ fontSize: 11, color: k.delta.startsWith("+") ? C.green : C.red }}>{k.delta} vs mes anterior</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ ...sx.card, marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📈 Rendimiento semanal — Clics y Conversiones</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weekData}>
                <XAxis dataKey="day" stroke={C.muted} tick={{ fontSize: 11, fill: C.muted }} />
                <YAxis stroke={C.muted} tick={{ fontSize: 11, fill: C.muted }} width={40} />
                <Tooltip {...TT} />
                <Area type="monotone" dataKey="clics" stroke="#4285F4" fill="#4285F418" strokeWidth={2} name="Clics" />
                <Area type="monotone" dataKey="conv"  stroke="#34A853" fill="#34A85318" strokeWidth={2} name="Conversiones" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {[["Clics","#4285F4"],["Conversiones","#34A853"]].map(([n,col]) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.sub }}>
                  <div style={{ width: 10, height: 3, borderRadius: 2, background: col }} /> {n}
                </div>
              ))}
            </div>
          </div>

          {/* Gasto vs presupuesto */}
          <div style={{ ...sx.card, marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>💰 Presupuesto utilizado por campaña</div>
            {campaigns.filter(c => c.status === "Activa").map(c => {
              const pct = Math.round((parseFloat(c.spent.replace("$","")) / parseFloat(c.budget.replace("$",""))) * 100)
              return (
                <div key={c.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: C.sub }}>{c.name}</span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{c.spent} / {c.budget}</span>
                  </div>
                  <BarLine pct={pct} col={pct >= 90 ? C.orange : "#4285F4"} />
                </div>
              )
            })}
          </div>

          {/* AI insight */}
          <div style={{ ...sx.card, borderLeft: "3px solid #4285F4", background: "#4285F40A" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4285F4", marginBottom: 8 }}>🤖 Análisis IA — Google Ads</div>
            <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.75 }}>
              Agenda Canina <strong style={{ color: C.orange }}>actualmente no tiene campañas de Google Ads activas</strong> — esto representa una oportunidad significativa sin explotar.
              La keyword <strong style={{ color: C.text }}>"adiestramiento canino Bogotá"</strong> tiene alta intención de compra con baja competencia local.
              Se estima un <strong style={{ color: C.green }}>ROI de 3.2x</strong> con una inversión de $480K COP/mes generando ~48 leads cualificados.
              Recomendación prioritaria: iniciar con campaña de <strong style={{ color: C.text }}>Búsqueda en Bogotá</strong> enfocada en keywords de alta intención como "adiestramiento canino Bogotá" y "comportamiento canino".
            </p>
          </div>
        </>
      )}

      {/* ── TAB: CAMPAÑAS ── */}
      {tab === "campanas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {campaigns.map((c, i) => (
            <div key={i} style={sx.card}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{c.name}</span>
                <Tag col={c.status === "Activa" ? C.green : C.orange}>{c.status}</Tag>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 8 }}>
                {[
                  { l: "Presupuesto", v: c.budget, col: "#4285F4" },
                  { l: "Gastado",     v: c.spent,  col: C.orange  },
                  { l: "Clics",       v: c.clicks, col: "#FBBC05" },
                  { l: "Conv.",       v: c.conv,   col: "#34A853" },
                  { l: "CTR",         v: c.ctr,    col: C.cyan    },
                  { l: "ROAS",        v: c.roas,   col: C.purple  },
                ].map(m => (
                  <div key={m.l} style={{ background: `${m.col}0D`, border: `1px solid ${m.col}33`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: m.col }}>{m.v}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: KEYWORDS ── */}
      {tab === "keywords" && (
        <>
          <div style={{ ...sx.card, borderLeft: `3px solid #FBBC05`, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.sub }}>
              💡 Las palabras clave con <strong style={{ color: C.text }}>intención Muy Alta</strong> representan el 68% de tus conversiones con solo el 34% del presupuesto. Prioriza estas primero.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {keywords.map((k, i) => (
              <div key={i} style={{ ...sx.card, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{k.kw}</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Tag col="#4285F4">👆 {k.clics} clics</Tag>
                  <Tag col="#34A853">✓ {k.conv} conv.</Tag>
                  <Tag col="#FBBC05">$ {k.cpc}</Tag>
                  <Tag col={k.col}>Intent: {k.intent}</Tag>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TAB: ANUNCIOS ── */}
      {tab === "anuncios" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ads.map((a, i) => (
            <div key={i} style={sx.card}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#4285F4", marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.6 }}>{a.desc}</div>
                </div>
                <Tag col={scoreCol(a.score)}>{a.status}</Tag>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <Tag col="#4285F4">CTR {a.ctr}</Tag>
                <Tag col="#34A853">{a.conv} conv.</Tag>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <span style={{ fontSize: 11, color: C.muted, minWidth: 48 }}>Ad score</span>
                  <BarLine pct={a.score * 10} col={scoreCol(a.score)} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: scoreCol(a.score), minWidth: 26 }}>{a.score}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Sugerencia IA */}
          <div style={{ ...sx.card, borderLeft: "3px solid #34A853", background: "#34A85308" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#34A853", marginBottom: 8 }}>🤖 IA — Nuevo anuncio sugerido</div>
            <div style={{ background: "#4285F40D", border: "1px solid #4285F433", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#4285F4", marginBottom: 4 }}>Agenda Canina — Tu Veterinaria de Confianza</div>
              <div style={{ fontSize: 12, color: C.sub }}>Más de 5,000 mascotas atendidas. Reserva online en 2 minutos. Consulta + vacunas desde $299.</div>
            </div>
            <div style={{ fontSize: 12, color: C.sub }}>CTR estimado: <strong style={{ color: C.green }}>5.2%</strong> · Basado en tus mejores anuncios activos</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: WHATSAPP BUSINESS
// ══════════════════════════════════════════════════════════════════════════════
function ModWhatsApp() {
  const [pipelineFilter, setPipelineFilter] = useState("Todos")
  const [activeTab, setActiveTab] = useState("resumen")

  const kpis = [
    { label: "Mensajes enviados",     value: "3,847",  delta: "+18%", col: C.wa    },
    { label: "Tasa de apertura",      value: "94.2%",  delta: "+3%",  col: C.green },
    { label: "Tasa de respuesta",     value: "67.8%",  delta: "+11%", col: C.cyan  },
    { label: "Leads generados",       value: "128",    delta: "+24%", col: C.purple},
    { label: "Conversiones",          value: "43",     delta: "+31%", col: C.orange},
    { label: "Costo por lead",        value: "$2.40",  delta: "-12%", col: C.pink  },
  ]

  const pipeline = [
    { id:1,  nombre: "Laura Mendoza",    empresa: "Consultora LM",    estado: "Cerrado ✅",     canal: "Instagram → WA", valor: "$1,200", fecha: "Hace 1 día",  avatar: "LM" },
    { id:2,  nombre: "Carlos Ruiz",      empresa: "Tienda Online CR",  estado: "Calificado 🔥", canal: "TikTok → WA",    valor: "$850",   fecha: "Hace 2 días", avatar: "CR" },
    { id:3,  nombre: "Ana Torres",       empresa: "Agencia AT",        estado: "En contacto 💬", canal: "LinkedIn → WA",  valor: "$2,400", fecha: "Hace 2 días", avatar: "AT" },
    { id:4,  nombre: "Miguel Flores",    empresa: "MF Branding",       estado: "Calificado 🔥", canal: "Reel → WA",      valor: "$600",   fecha: "Hace 3 días", avatar: "MF" },
    { id:5,  nombre: "Sofía Navarro",    empresa: "SN Coaching",       estado: "En contacto 💬", canal: "Email → WA",     valor: "$3,000", fecha: "Hace 3 días", avatar: "SN" },
    { id:6,  nombre: "Diego Herrera",    empresa: "DH Digital",        estado: "Nuevo 🆕",       canal: "Stories → WA",   valor: "$450",   fecha: "Hace 5 días", avatar: "DH" },
    { id:7,  nombre: "Paula Jiménez",    empresa: "Paula Coaching",    estado: "Nuevo 🆕",       canal: "TikTok → WA",    valor: "$1,800", fecha: "Hace 6 días", avatar: "PJ" },
    { id:8,  nombre: "Roberto Soto",     empresa: "RS Negocios",       estado: "Cerrado ✅",     canal: "Carrusel → WA",  valor: "$950",   fecha: "Hace 7 días", avatar: "RS" },
  ]

  const templates = [
    { nombre: "Bienvenida con lead magnet",    apertura: "96%", respuesta: "74%", tipo: "Captura",      texto: "¡Hola {{nombre}}! 👋 Vi que descargaste la guía. ¿Tienes 10 min para contarte cómo aplicarla a tu caso específico?" },
    { nombre: "Seguimiento post-contenido",    apertura: "91%", respuesta: "68%", tipo: "Seguimiento",  texto: "Hola {{nombre}}, ¿pudiste ver el video que compartí? Muchos como tú lo aplicaron y tuvieron estos resultados… ¿quieres saber cómo?" },
    { nombre: "Oferta de consulta gratuita",   apertura: "88%", respuesta: "61%", tipo: "Conversión",   texto: "{{nombre}}, tengo un espacio libre esta semana para una sesión gratuita de 30 min. ¿Te sirve el martes o el jueves?" },
    { nombre: "Reactivación de contactos",     apertura: "83%", respuesta: "52%", tipo: "Reactivación", texto: "¡Hola {{nombre}}! Hace tiempo no hablamos. Acabo de lanzar algo que creo que te puede interesar mucho. ¿Tienes un momento?" },
    { nombre: "Cierre de venta directo",       apertura: "79%", respuesta: "58%", tipo: "Cierre",       texto: "{{nombre}}, antes de que cierre el acceso quería darte prioridad. ¿Avanzamos hoy?" },
  ]

  const campaigns = [
    { nombre: "Lanzamiento Programa Premium",  enviados: 420, apertura: "94%", respuesta: "71%", leads: 38, estado: "Activa",    col: C.green  },
    { nombre: "Seguimiento Webinar Mayo",       enviados: 312, apertura: "89%", respuesta: "64%", leads: 27, estado: "Completada", col: C.cyan   },
    { nombre: "Reactivación Base Fría",         enviados: 680, apertura: "76%", respuesta: "43%", leads: 19, estado: "Activa",    col: C.green  },
    { nombre: "Oferta Flash 48h",               enviados: 215, apertura: "97%", respuesta: "82%", leads: 44, estado: "Completada", col: C.cyan   },
  ]

  const estadoCol = (e) => {
    if (e.includes("Cerrado"))   return C.green
    if (e.includes("Calificado")) return C.orange
    if (e.includes("contacto"))  return C.cyan
    return C.muted
  }

  const pipelineStats = [
    { label: "Nuevos",      count: 2,  col: C.muted  },
    { label: "En contacto", count: 2,  col: C.cyan   },
    { label: "Calificados", count: 2,  col: C.orange },
    { label: "Cerrados",    count: 2,  col: C.green  },
  ]

  const filteredPipeline = pipelineFilter === "Todos" ? pipeline : pipeline.filter(p => p.estado.includes(
    pipelineFilter === "Cerrado" ? "Cerrado" : pipelineFilter === "Calificado" ? "Calificado" : pipelineFilter === "En contacto" ? "contacto" : "Nuevo"
  ))

  const tabs = [
    { id: "resumen",    label: "Resumen",   col: C.wa     },
    { id: "pipeline",   label: "Pipeline",  col: C.purple },
    { id: "templates",  label: "Plantillas",col: C.cyan   },
    { id: "campanas",   label: "Campañas",  col: C.orange },
  ]

  const inputSt = { background: "#ffffff0D", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, outline: "none" }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.wa}22`, border: `1px solid ${C.wa}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💬</div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>WhatsApp Business</h2>
          <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Mensajería · Leads · Pipeline · Campañas</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ ...sx.tag(C.wa), fontSize: 11 }}>● Conectado</span>
          <span style={{ ...sx.tag(C.green), fontSize: 11 }}>API Activa</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: activeTab === t.id ? t.col : C.card2,
            color: activeTab === t.id ? "#fff" : C.sub,
            border: `1px solid ${activeTab === t.id ? t.col : C.border}`,
            borderRadius: 20, padding: "6px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s"
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: RESUMEN ── */}
      {activeTab === "resumen" && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10, marginBottom: 18 }}>
            {kpis.map(k => (
              <div key={k.label} style={{ ...sx.card, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.9 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: k.col }}>{k.value}</div>
                <div style={{ fontSize: 11, color: k.delta.startsWith("+") ? C.green : C.red }}>{k.delta} vs mes anterior</div>
              </div>
            ))}
          </div>

          {/* Funnel visual */}
          <div style={{ ...sx.card, marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📊 Funnel de conversión WhatsApp</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Mensajes enviados",  value: 3847, pct: 100, col: C.wa     },
                { label: "Mensajes abiertos",  value: 3624, pct: 94,  col: C.green  },
                { label: "Respuestas recibidas",value: 2608, pct: 68, col: C.cyan   },
                { label: "Leads calificados",  value: 128,  pct: 33,  col: C.purple },
                { label: "Conversiones",        value: 43,   pct: 11,  col: C.orange },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: C.sub, minWidth: 168 }}>{row.label}</span>
                  <BarLine pct={row.pct} col={row.col} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: row.col, minWidth: 36 }}>{row.pct}%</span>
                  <span style={{ fontSize: 11, color: C.muted, minWidth: 36 }}>{row.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline mini summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
            {pipelineStats.map(p => (
              <div key={p.label} style={{ ...sx.card, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: p.col }}>{p.count}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{p.label}</div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div style={{ ...sx.card, borderLeft: `3px solid ${C.wa}`, background: `${C.wa}0A` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.wa, marginBottom: 8 }}>🤖 Análisis IA — WhatsApp</div>
            <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.75 }}>
              Tu tasa de apertura del <strong style={{ color: C.wa }}>94.2%</strong> está muy por encima del email (22% promedio).
              La plantilla de <strong style={{ color: C.text }}>"Oferta de consulta gratuita"</strong> genera un 61% de respuesta.
              Se detectan <strong style={{ color: C.orange }}>5 leads sin responder</strong> en las últimas 48 horas — alto riesgo de pérdida.
              El mejor horario para enviar mensajes es <strong style={{ color: C.text }}>martes y jueves 10:00-12:00</strong> y <strong style={{ color: C.text }}>19:00-20:00</strong>.
              Recomendación: activar seguimiento automático a los contactos que abrieron pero no respondieron.
            </p>
          </div>
        </>
      )}

      {/* ── TAB: PIPELINE ── */}
      {activeTab === "pipeline" && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["Todos", "Nuevo", "En contacto", "Calificado", "Cerrado"].map(f => (
              <button key={f} onClick={() => setPipelineFilter(f)} style={{
                background: pipelineFilter === f ? C.wa : C.card2,
                color: pipelineFilter === f ? "#fff" : C.sub,
                border: `1px solid ${pipelineFilter === f ? C.wa : C.border}`,
                borderRadius: 20, padding: "5px 13px", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s"
              }}>{f}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredPipeline.map(lead => (
              <div key={lead.id} style={{ ...sx.card, display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${C.wa}22`, border: `1px solid ${C.wa}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.wa, flexShrink: 0 }}>
                  {lead.avatar}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{lead.nombre}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>·</span>
                    <span style={{ fontSize: 12, color: C.sub }}>{lead.empresa}</span>
                    <span style={{ marginLeft: "auto" }}>
                      <Tag col={estadoCol(lead.estado)}>{lead.estado}</Tag>
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.muted }}>
                    <span>📲 {lead.canal}</span>
                    <span>💰 {lead.valor}</span>
                    <span>🕐 {lead.fecha}</span>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={{ background: `${C.wa}22`, border: `1px solid ${C.wa}55`, borderRadius: 7, padding: "5px 11px", cursor: "pointer", fontSize: 11, color: C.wa, fontWeight: 600 }}>💬 Responder</button>
                  <button style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 11px", cursor: "pointer", fontSize: 11, color: C.sub }}>Ver</button>
                </div>
              </div>
            ))}
          </div>

          {/* Valor total pipeline */}
          <div style={{ ...sx.card, marginTop: 16, display: "flex", gap: 24, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: C.muted }}>Valor total pipeline</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.green }}>$11,250</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.muted }}>Ticket promedio</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.cyan }}>$1,406</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.muted }}>Tasa de cierre</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.orange }}>33.6%</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button style={{ background: C.wa, border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                + Nuevo Lead
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── TAB: PLANTILLAS ── */}
      {activeTab === "templates" && (
        <>
          <div style={{ ...sx.card, borderLeft: `3px solid ${C.cyan}`, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.sub }}>
              💡 Las plantillas con mayor tasa de respuesta combinan <strong style={{ color: C.text }}>personalización + CTA claro + urgencia moderada</strong>. Edita el nombre entre dobles llaves: <code style={{ background: `${C.purple}22`, padding: "1px 5px", borderRadius: 4, fontSize: 11 }}>{"{{nombre}}"}</code>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {templates.map((t, i) => (
              <div key={i} style={sx.card}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{t.nombre}</span>
                  <Tag col={C.purple}>{t.tipo}</Tag>
                  <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <Tag col={C.wa}>📬 {t.apertura}</Tag>
                    <Tag col={C.green}>💬 {t.respuesta}</Tag>
                  </span>
                </div>
                {/* Message preview */}
                <div style={{ background: `${C.wa}0D`, border: `1px solid ${C.wa}33`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: C.sub, lineHeight: 1.6, marginBottom: 10, position: "relative" }}>
                  <div style={{ position: "absolute", top: -1, left: 12, width: 12, height: 12, background: `${C.wa}0D`, borderLeft: `1px solid ${C.wa}33`, borderTop: `1px solid ${C.wa}33`, transform: "rotate(45deg)" }} />
                  {t.texto}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ background: `${C.wa}22`, border: `1px solid ${C.wa}55`, borderRadius: 7, padding: "5px 13px", cursor: "pointer", fontSize: 11, color: C.wa, fontWeight: 600 }}>Usar plantilla</button>
                  <button style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 13px", cursor: "pointer", fontSize: 11, color: C.sub }}>Editar</button>
                  <button onClick={() => { try { navigator.clipboard.writeText(t.texto) } catch(e) {} }}
                    style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 13px", cursor: "pointer", fontSize: 11, color: C.sub }}>Copiar</button>
                </div>
              </div>
            ))}
          </div>

          {/* Nueva plantilla con IA */}
          <div style={{ ...sx.card, marginTop: 14, borderLeft: `3px solid ${C.purple}`, background: `${C.purple}0A` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, marginBottom: 8 }}>🤖 Generar nueva plantilla con IA</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Ej: plantilla para clientes que no respondieron en 3 días..." style={{ flex: 1, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none" }} />
              <button style={{ background: C.purple, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600 }}>Generar →</button>
            </div>
          </div>
        </>
      )}

      {/* ── TAB: CAMPAÑAS ── */}
      {activeTab === "campanas" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
            {[
              { v: "4",     l: "Campañas activas",   col: C.green  },
              { v: "1,627", l: "Mensajes este mes",   col: C.wa     },
              { v: "128",   l: "Leads generados",     col: C.purple },
            ].map(m => (
              <div key={m.l} style={{ ...sx.card, textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: m.col }}>{m.v}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{m.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {campaigns.map((c, i) => (
              <div key={i} style={sx.card}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c.nombre}</span>
                  <Tag col={c.estado === "Activa" ? C.green : C.cyan}>{c.estado}</Tag>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                  {[
                    { l: "Enviados",  v: c.enviados, col: C.wa     },
                    { l: "Apertura",  v: c.apertura, col: C.green  },
                    { l: "Respuesta", v: c.respuesta,col: C.cyan   },
                    { l: "Leads",     v: c.leads,    col: C.purple },
                  ].map(m => (
                    <div key={m.l} style={{ background: `${m.col}0D`, border: `1px solid ${m.col}33`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: m.col }}>{m.v}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Nueva campaña */}
          <div style={{ ...sx.card, borderLeft: `3px solid ${C.wa}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.wa, marginBottom: 14 }}>📢 Nueva campaña</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>NOMBRE DE LA CAMPAÑA</div>
                <input placeholder="Ej: Lanzamiento Julio 2026" style={{ width: "100%", ...inputSt, boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>PLANTILLA A USAR</div>
                <select style={{ width: "100%", ...inputSt, boxSizing: "border-box" }}>
                  {templates.map(t => <option key={t.nombre}>{t.nombre}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>SEGMENTO</div>
                <select style={{ width: "100%", ...inputSt, boxSizing: "border-box" }}>
                  <option>Todos los leads</option>
                  <option>Sin respuesta +3 días</option>
                  <option>Leads calificados</option>
                  <option>Base fría</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>HORARIO DE ENVÍO</div>
                <select style={{ width: "100%", ...inputSt, boxSizing: "border-box" }}>
                  <option>Ahora</option>
                  <option>Martes 10:00 AM</option>
                  <option>Jueves 07:00 PM</option>
                  <option>Personalizado</option>
                </select>
              </div>
            </div>
            <button style={{ background: C.wa, border: "none", borderRadius: 9, padding: "10px 22px", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600 }}>
              🚀 Lanzar campaña
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SIDEBAR NAV
// ══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "inicio",      label: "Inicio",        icon: "🏠" },
  { id: "posts",       label: "Posts",          icon: "📋" },
  { id: "constancia",  label: "Constancia",     icon: "📅" },
  { id: "ideas",       label: "Ideas IA",       icon: "💡" },
  { id: "audiencia",   label: "Audiencia",      icon: "👥" },
  { id: "tendencias",  label: "Tendencias",     icon: "📈" },
  { id: "googleads",   label: "Google Ads",     icon: "G" },
  { id: "whatsapp",    label: "WhatsApp",       icon: "💬" },
  { id: "chat",        label: "Chat IA",        icon: "🤖" },
  { id: "config",      label: "Configuración",  icon: "⚙️" },
]

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [mod, setMod] = useState("inicio")
  const [config, setConfig] = useState({
    client: "Agenda Canina",
    industry: "Comportamiento y Adiestramiento Canino",
    country: "Colombia",
    goal: "Generar Leads",
    tone: "Cercano y amigable",
    offer: "Sesiones de comportamiento y adiestramiento canino",
    idealClient: "Dueños de perros con problemas de conducta",
    cta: "Reserva tu sesión aquí",
    networks: ["Instagram", "WhatsApp"],
  })

  const current = NAV.find(n => n.id === mod)

  const renderMod = () => {
    switch (mod) {
      case "inicio":     return <ModInicio />
      case "posts":      return <ModPosts />
      case "constancia": return <ModConstancia />
      case "ideas":      return <ModIdeas />
      case "audiencia":  return <ModAudiencia />
      case "tendencias": return <ModTendencias />
      case "googleads":  return <ModGoogleAds />
      case "whatsapp":   return <ModWhatsApp />
      case "chat":       return <ModChat />
      case "config":     return <ModConfig config={config} setConfig={setConfig} />
      default:           return <ModInicio />
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflow: "hidden" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 216, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: "18px 14px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.purple, letterSpacing: -0.3 }}>Sales Velocity</div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1, marginTop: 1 }}>AI DASHBOARD · v1.0</div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
            <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>{config.client || "Demo Brand"}</span>
          </div>
          {config.industry && (
            <div style={{ marginTop: 4, fontSize: 11, color: C.muted }}>{config.industry}</div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setMod(item.id)} style={sx.navBtn(mod === item.id)}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ fontSize: 13 }}>{item.label}</span>
              {mod === item.id && (
                <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.purple }} />
              )}
            </button>
          ))}
        </nav>

        {/* Channels active */}
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 7, textTransform: "uppercase", letterSpacing: 1 }}>Canales activos</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {(config.networks || []).map(n => {
              const col = { Instagram: C.ig, TikTok: C.tk, LinkedIn: C.li, YouTube: C.yt, Facebook: C.fb, WhatsApp: C.wa }[n] || C.purple
              return <span key={n} style={{ ...sx.tag(col), fontSize: 10 }}>{n.slice(0, 2)}</span>
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.muted }}>Powered by</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>Claude AI · Anthropic</div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", height: 52, borderBottom: `1px solid ${C.border}`, background: C.sidebar, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>{current?.icon}</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{current?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...sx.tag(C.green), fontSize: 11 }}>● Live</span>
            <span style={{ fontSize: 12, color: C.muted }}>Jun 2026</span>
            <div style={{ width: 30, height: 30, background: `${C.purple}33`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
          </div>
        </div>

        {/* Module content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {renderMod()}
        </div>
      </div>
    </div>
  )
}
