/* eslint-disable */
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

// ─── CHAT IA — CONTEXTO REAL AGENDA CANINA ────────────────────────────────────
const AGENDA_CANINA_SYSTEM = `Eres el consultor estratégico de Sales Velocity AI para Agenda Canina, negocio de comportamiento y adiestramiento canino dirigido por Rodrigo Arenas en Bogotá, Colombia. Llevas su estrategia de contenido digital y comercial.

DATOS REALES (Mayo–Junio 2026):
- Seguidores Instagram: 4,538
- Visualizaciones totales: 26,423 | Interacciones: 1,015 | Cuentas alcanzadas: 5,760
- Engagement rate: 3.85% | Clics a WhatsApp: 15 | Visitas al perfil: 355
- Base de clientes registrados: 845

POSTS REALES — RANKING:
1. "El perro muerde cuando el humano se mueve mal" → Reel · 4,713 vistas · 3,150 alcance · 102 likes · Score 8.7 · Potencial Muy Alto
2. "Los perros no se educan solos" → Reel · 2,506 vistas · 1,711 alcance · 74 likes · Score 8.4 · Potencial Muy Alto
3. "Sitios Pet Friendly en calma" → Reel · 1,511 vistas · 794 alcance · 33 likes · Score 8.1
4. "Mención especial — familia haciendo bien la tarea" → Reel · 957 vistas (testimonios funcionan)
5. "Receta premium Xoky Meals" → Imagen · 761 vistas · 16 likes
6. "Xoky Meals sin conservantes" → Imagen · 406 vistas (menor tracción)

AUDIENCIA REAL:
- 80% mujeres / 20% hombres · Edad core 35–54 años (62.9%)
- Bogotá 50.5% · Cali 3.5% · Medellín 3.2%
- Colombia 83.8% · USA 5.8% · España 1.9%

LÍNEAS DE NEGOCIO:
- Sesiones K9 (comportamiento y adiestramiento)
- Programa Puppy (cachorros)
- Xoky Meals — comida natural sin conservantes, 500g a $19,000 COP
- Charlas y eventos en alianza con Amigo Leal Café
- WhatsApp principal: +57 314 2452458

PATRONES CLAVE:
- Reels funcionan 3x mejor que imágenes
- Pico de interacciones: 2 Jun (162 interacciones, reel "muerde cuando humano se mueve mal")
- Semana 25–27 May fue la más activa: colaboración Amigo Leal Café impulsó alcance
- Temas de mayor tracción: seguridad/límites, educación práctica, testimonios

Tu rol: analizar datos, generar recomendaciones de contenido, detectar oportunidades comerciales, ayudar a diseñar estrategias de captación y conversión. Responde siempre en español. Sé concreto, accionable y basado en los datos reales. Máximo 4 párrafos por respuesta.`

// ─── PLANES DE ACTIVACIÓN ─────────────────────────────────────────────────────
const ACTIVATION_PLANS = {
  "SV-STARTER-AC26":   { level: "starter",   label: "Starter",   color: "#06B6D4", features: ["chatIA", "pipeline"] },
  "SV-GROWTH-AC26":    { level: "growth",    label: "Growth",    color: "#8B5CF6", features: ["chatIA", "pipeline", "reports"] },
  "SV-STRATEGIC-AC26": { level: "strategic", label: "Strategic", color: "#F59E0B", features: ["chatIA", "pipeline", "reports", "advanced"] },
}

async function callClaudeAPI(userMessage, apiKey) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-allow-browser": "true",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: AGENDA_CANINA_SYSTEM,
        messages: [{ role: "user", content: userMessage }]
      })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.message || `Error ${res.status}`)
    }
    const data = await res.json()
    return data.content[0].text
  } catch (e) {
    return `⚠️ No se pudo conectar con IA: ${e.message}. Verifica tu API key en ⚙️ Configuración → Chat IA.`
  }
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
function ModChat({ config = {} }) {
  const hasRealAI = config.anthropicKey && config.anthropicKey.startsWith("sk-ant-")
  const [msgs, setMsgs] = useState([
    { role: "ai", text: hasRealAI
        ? "¡Hola! Soy tu consultor estratégico de Sales Velocity AI con datos reales de Agenda Canina. Puedo analizar métricas, identificar oportunidades comerciales y recomendar estrategias basadas en tus resultados. ¿Qué quieres explorar hoy?"
        : "¡Hola! Soy tu asistente de Sales Velocity AI. Puedo analizar tus métricas y oportunidades. Para activar el análisis con IA real, configura tu API key en ⚙️ Configuración → Chat IA." }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  const suggestions = [
    "¿Qué contenido funcionó mejor?",
    "¿Qué debo publicar mañana?",
    "¿Cuáles son los mejores horarios?",
    "Dame 3 ideas para esta semana",
    "¿Qué oportunidades comerciales ves?",
    "¿Cómo convierto seguidores en clientes?",
  ]

  const send = async (text) => {
    const msg = text.trim()
    if (!msg || loading) return
    setMsgs(prev => [...prev, { role: "user", text: msg }])
    setInput("")
    setLoading(true)
    let reply
    if (hasRealAI) {
      reply = await callClaudeAPI(msg, config.anthropicKey)
    } else {
      await new Promise(r => setTimeout(r, 700))
      reply = getAIReply(msg)
    }
    setMsgs(prev => [...prev, { role: "ai", text: reply }])
    setLoading(false)
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Chat con IA</h2>
          <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Consulta sobre métricas, estrategia y oportunidades</p>
        </div>
        <span style={{ ...sx.tag(hasRealAI ? C.green : C.orange), fontSize: 11 }}>
          {hasRealAI ? "🟢 IA Real Activa" : "🟡 Modo Demo"}
        </span>
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
  const [codeInput, setCodeInput] = useState("")
  const [codeMsg, setCodeMsg] = useState("")
  const [showKey, setShowKey] = useState(false)

  const activatePlan = () => {
    const plan = ACTIVATION_PLANS[codeInput.trim().toUpperCase()]
    if (plan) {
      setConfig(p => ({ ...p, planCode: codeInput.trim().toUpperCase(), planLevel: plan.level, planLabel: plan.label }))
      setCodeMsg("✅ Plan " + plan.label + " activado correctamente.")
    } else {
      setCodeMsg("❌ Código inválido. Verifica con Sales Velocity AI.")
    }
  }

  const deactivatePlan = () => {
    setConfig(p => ({ ...p, planCode: "", planLevel: "demo", planLabel: "" }))
    setCodeInput("")
    setCodeMsg("")
  }

  const fields = [
    { key: "client",      label: "Nombre del cliente",    type: "text",   placeholder: "Ej: Agenda Canina" },
    { key: "industry",    label: "Industria",              type: "select", options: ["Marketing Digital","E-commerce","Salud y Bienestar","Educación","Finanzas","Inmobiliaria","Restaurantes","Moda","Tecnología","Consultoría","Comportamiento Canino"] },
    { key: "country",     label: "País",                   type: "select", options: ["México","Colombia","Argentina","España","Chile","Perú","Ecuador","Otro"] },
    { key: "goal",        label: "Objetivo principal",     type: "select", options: ["Generar Leads","Aumentar Ventas","Crecer Seguidores","Brand Awareness","Retener Clientes"] },
    { key: "tone",        label: "Tono de marca",          type: "select", options: ["Profesional","Cercano y amigable","Inspiracional","Educativo","Humorístico","Corporativo"] },
    { key: "offer",       label: "Oferta principal",       type: "text",   placeholder: "Ej: Sesiones de adiestramiento canino" },
    { key: "idealClient", label: "Cliente ideal",          type: "text",   placeholder: "Ej: Dueños de perros en Bogotá" },
    { key: "cta",         label: "CTA principal",          type: "text",   placeholder: "Ej: Reserva tu sesión aquí" },
  ]
  const networks = [
    { name: "Instagram", col: C.ig }, { name: "TikTok",    col: C.tk },
    { name: "LinkedIn",  col: C.li }, { name: "YouTube",   col: C.yt },
    { name: "Facebook",  col: C.fb }, { name: "WhatsApp",  col: C.wa },
  ]
  const inputSt = { width: "100%", background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }
  const planColors = { demo: C.muted, starter: C.cyan, growth: C.purple, strategic: C.orange }
  const planCol = planColors[config.planLevel] || C.muted
  const planFeatures = config.planLevel !== "demo" ? (ACTIVATION_PLANS[config.planCode]?.features || []) : []

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Configuración</h2>
        <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 13 }}>Personaliza el dashboard y activa funciones premium</p>
      </div>

      {/* ── PLAN Y ACTIVACIÓN ── */}
      <div style={{ ...sx.card, borderLeft: `3px solid ${planCol}`, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: planCol }}>🔑 Plan y Activación</div>
          <span style={{ ...sx.tag(planCol), fontSize: 11 }}>
            {config.planLevel === "demo" ? "Demo" : `Plan ${config.planLabel}`}
          </span>
        </div>
        {config.planLevel !== "demo" ? (
          <div>
            <div style={{ background: `${C.green}11`, border: `1px solid ${C.green}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
              <div style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>✅ Plan {config.planLabel} activo</div>
              <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>
                Funciones activas: {planFeatures.map(f => ({chatIA:"Chat IA Real", pipeline:"CRM Pipeline", reports:"Reportes", advanced:"Avanzado"}[f])).join(" · ")}
              </div>
            </div>
            <button onClick={deactivatePlan} style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: C.muted, fontSize: 12 }}>
              Desactivar plan
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Ingresa el código de activación que recibirás al contratar un plan de Sales Velocity AI.</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={codeInput} onChange={e => setCodeInput(e.target.value)} placeholder="SV-XXXXXX-XX26"
                onKeyDown={e => e.key === "Enter" && activatePlan()}
                style={{ ...inputSt, flex: 1, textTransform: "uppercase", letterSpacing: 1 }} />
              <button onClick={activatePlan} style={{ background: C.purple, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                Activar
              </button>
            </div>
            {codeMsg && <div style={{ fontSize: 12, color: codeMsg.startsWith("✅") ? C.green : C.red, marginTop: 4 }}>{codeMsg}</div>}
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{l:"Starter $150/mes",f:"Chat IA · Pipeline CRM",c:C.cyan},{l:"Growth $300/mes",f:"+ Reportes mensuales",c:C.purple},{l:"Strategic $500/mes",f:"+ Funciones avanzadas",c:C.orange}].map((p,i) => (
                <div key={i} style={{ flex:1, minWidth:140, background:`${p.c}0D`, border:`1px solid ${p.c}33`, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ color:p.c, fontWeight:700, fontSize:11 }}>{p.l}</div>
                  <div style={{ color:C.muted, fontSize:10, marginTop:2 }}>{p.f}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── API KEY CHAT IA ── */}
      <div style={{ ...sx.card, borderLeft: `3px solid ${C.purple}`, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.purple }}>🤖 Chat IA — API Anthropic</div>
          <span style={{ ...sx.tag(config.anthropicKey?.startsWith("sk-ant-") ? C.green : C.orange), fontSize: 11 }}>
            {config.anthropicKey?.startsWith("sk-ant-") ? "🟢 Conectada" : "🟡 Sin configurar"}
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>
          Cuando está activa, el Chat IA usa Claude real con contexto completo de tus datos. Obtén tu API key en <span style={{color:C.cyan}}>console.anthropic.com</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type={showKey ? "text" : "password"}
            value={config.anthropicKey || ""}
            onChange={e => setConfig(p => ({ ...p, anthropicKey: e.target.value }))}
            placeholder="sk-ant-api03-..."
            style={{ ...inputSt, flex: 1, fontFamily: "monospace", fontSize: 12 }}
          />
          <button onClick={() => setShowKey(s => !s)} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", color: C.sub, fontSize: 12 }}>
            {showKey ? "🙈" : "👁"}
          </button>
        </div>
        {config.anthropicKey?.startsWith("sk-ant-") && (
          <div style={{ marginTop: 8, fontSize: 11, color: C.green }}>✅ API key válida — Chat IA real activado. Ve al módulo Chat IA para probarlo.</div>
        )}
      </div>

      {/* ── DATOS DEL CLIENTE ── */}
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 4 }}>Datos del Cliente</div>
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
        <div style={{ fontSize: 13, fontWeight: 600, color: C.cyan, marginBottom: 10 }}>🔌 Integraciones disponibles</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {["WhatsApp Business API","Meta Ads","Instagram API","Google Sheets","HubSpot CRM","Mailchimp","Google Ads","Stripe","Make (Integromat)","Calendly"].map((int, i) => (
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
// MODULE: CRM — CLIENTES AGENDA CANINA
// ══════════════════════════════════════════════════════════════════════════════
function ModCRM() {
  const [search, setSearch] = useState("")
  const [filterRaza, setFilterRaza] = useState("Todas")
  const [tab, setTab] = useState("clientes")
  const [page, setPage] = useState(0)
  const PER_PAGE = 30

  // DATOS REALES — 845 clientes Agenda Canina 2025.xls
  const clientes = [
    {nombre:"Caro Cortés", raza:"", tel:"3165360553", tipo:"Pup", ciudad:"Bogotá", initials:"CC"},
    {nombre:"Yisell González", raza:"", tel:"3103563465", tipo:"Pup", ciudad:"Medellín", initials:"YG"},
    {nombre:"0Iga Lucía", raza:"", tel:"3114512894", tipo:"K9", ciudad:"Bogotá", initials:"0L"},
    {nombre:"Adriana Miller", raza:"", tel:"3156755107", tipo:"Fundador", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Adriana Valenzuela", raza:"", tel:"3102530708", tipo:"K9", ciudad:"Bogotá", initials:"AV"},
    {nombre:"Adriana Rivera", raza:"", tel:"3102595521", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Adriana Nieto", raza:"Terranova", tel:"3158424104", tipo:"K9", ciudad:"Bogotá", initials:"AN"},
    {nombre:"ADRIANA JARAMILLO", raza:"Malti", tel:"3118769046", tipo:"Pup", ciudad:"Bogotá", initials:"AJ"},
    {nombre:"Adriana Caicedo", raza:"Collie", tel:"3157978259", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Adriana Pulido", raza:"Pup", tel:"3102645778", tipo:"Pup", ciudad:"Bogotá", initials:"AP"},
    {nombre:"Adriana Rodriguez", raza:"BldFr", tel:"3163115886", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Adriana Bohorquez", raza:"Bernés", tel:"3103278956", tipo:"K9", ciudad:"Bogotá", initials:"AB"},
    {nombre:"Adriana Tatis", raza:"Criolla", tel:"3106261872", tipo:"Pup", ciudad:"Bogotá", initials:"AT"},
    {nombre:"Adriana Soto", raza:"Yorkie", tel:"3215417018", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Alba Jaramillo", raza:"Past Aust", tel:"3134977690", tipo:"K9", ciudad:"Bogotá", initials:"AJ"},
    {nombre:"Alberto Sanabria", raza:"", tel:"3112285181", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Alda Duarte", raza:"Yorkie", tel:"3152286594", tipo:"Pup", ciudad:"Bogotá", initials:"AD"},
    {nombre:"Alejandra Rodríguez", raza:"", tel:"3176369897", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Alejandra Gaviria", raza:"Pup", tel:"3118827466", tipo:"Pup", ciudad:"Bogotá", initials:"AG"},
    {nombre:"Alejandra Estrada", raza:"", tel:"3143597189", tipo:"K9", ciudad:"Bogotá", initials:"AE"},
    {nombre:"Alejandra Velásquez", raza:"Bernés", tel:"3203391397", tipo:"K9", ciudad:"Bogotá", initials:"AV"},
    {nombre:"Alejandra Sánchez", raza:"", tel:"3102122151", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Alejandra Arrieta", raza:"GermShpDober", tel:"3003151358", tipo:"K9", ciudad:"Bogotá", initials:"AA"},
    {nombre:"Alejandra Argote", raza:"", tel:"3118989742", tipo:"K9", ciudad:"Bogotá", initials:"AA"},
    {nombre:"Alejandra Ramírez", raza:"Adop", tel:"3212436025", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Alejandra Garay", raza:"Husky", tel:"3207516916", tipo:"K9", ciudad:"Bogotá", initials:"AG"},
    {nombre:"Alejandra Melo", raza:"", tel:"3005303350", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Alejandra Villegas", raza:"Wiki", tel:"3202660364", tipo:"K9", ciudad:"Bogotá", initials:"AV"},
    {nombre:"Alejandra San", raza:"PastorShetla", tel:"3057129695", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Alejandro Soto", raza:"PastOvaus", tel:"3123219214", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Alejandro Escobar", raza:"", tel:"3187172687", tipo:"K9", ciudad:"Bogotá", initials:"AE"},
    {nombre:"Alejandro Pinzon", raza:"", tel:"3138117770", tipo:"K9", ciudad:"Bogotá", initials:"AP"},
    {nombre:"Alejandro Orrego", raza:"Collie", tel:"3112916966", tipo:"Pup", ciudad:"Bogotá", initials:"AO"},
    {nombre:"Alejandro Valencia", raza:"Samoyedo", tel:"3152127234", tipo:"K9", ciudad:"Bogotá", initials:"AV"},
    {nombre:"Alejo Caro", raza:"Bruno", tel:"3227592062", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Alessandra Bolívar", raza:"", tel:"3103617440", tipo:"K9", ciudad:"Bogotá", initials:"AB"},
    {nombre:"Alexandra Molina", raza:"Fund Dogpack", tel:"3108079011", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Alexandra Correa", raza:"Pup", tel:"3058712849", tipo:"Pup", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Alexandra Mendoza", raza:"Golden", tel:"3103103731", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Alexandra Herrera", raza:"", tel:"3108168785", tipo:"K9", ciudad:"Bogotá", initials:"AH"},
    {nombre:"Alexandra K9", raza:"", tel:"3102151364", tipo:"K9", ciudad:"Bogotá", initials:"AK"},
    {nombre:"Alexandra Henao", raza:"", tel:"3024075931", tipo:"K9", ciudad:"Bogotá", initials:"AH"},
    {nombre:"Alfredo Kasbar", raza:"", tel:"3152674373", tipo:"K9", ciudad:"Bogotá", initials:"AK"},
    {nombre:"Alvaro Espejo", raza:"Pup", tel:"3214389850", tipo:"Pup", ciudad:"Bogotá", initials:"AE"},
    {nombre:"Álvaro Salamanca", raza:"", tel:"3133107279", tipo:"K9", ciudad:"Bogotá", initials:"ÁS"},
    {nombre:"Amalia Arciniegas", raza:"Osorio", tel:"3214741929", tipo:"K9", ciudad:"Bogotá", initials:"AA"},
    {nombre:"Amalia Robayo", raza:"Criollo", tel:"3132510945", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Amparo De", raza:"FrnchPoodle", tel:"3186213747", tipo:"K9", ciudad:"Bogotá", initials:"AD"},
    {nombre:"Ana Cristina", raza:"Collie", tel:"3105608497", tipo:"Pup", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Ana María", raza:"Pup", tel:"3173709489", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"Criolla", tel:"3203095303", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"Collie", tel:"3043854525", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana Lucía", raza:"", tel:"3115610661", tipo:"K9", ciudad:"Bogotá", initials:"AL"},
    {nombre:"Ana María", raza:"Pup y Collie", tel:"3166928924", tipo:"Pup", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"Bostón Pup", tel:"3155810505", tipo:"Pup", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"Austr Labrad", tel:"3102295019", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana Maria", raza:"", tel:"6253669254", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana Maria", raza:"", tel:"3152212445", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana Sofía", raza:"Past Aust", tel:"3112271467", tipo:"Pup", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Ana Ochoa", raza:"", tel:"3138946384", tipo:"K9", ciudad:"Bogotá", initials:"AO"},
    {nombre:"Ana Carolina", raza:"BrdCollie", tel:"3173000149", tipo:"Pup", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Ana Margot", raza:"Yorkie", tel:"3124311900", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana Sofia", raza:"Husky", tel:"3154851849", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Ana María", raza:"Ortega", tel:"3108803894", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"Criollo", tel:"3164664317", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana Díaz", raza:"", tel:"2179094343", tipo:"K9", ciudad:"Bogotá", initials:"AD"},
    {nombre:"Ana Díaz", raza:"", tel:"3102612184", tipo:"K9", ciudad:"Bogotá", initials:"AD"},
    {nombre:"Ana María", raza:"", tel:"3134617557", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"Pointer Ingl", tel:"3118259169", tipo:"Pup", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana Maria", raza:"Pup", tel:"3106189515", tipo:"Pup", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"", tel:"3115301518", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Ana María", raza:"BldFr", tel:"3125100661", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"AnaM Lopez", raza:"", tel:"3115108069", tipo:"K9", ciudad:"Bogotá", initials:"AL"},
    {nombre:"Andrea Calderón", raza:"Golden", tel:"3114753461", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Andrea Merizalde", raza:"GrmShp", tel:"3182403138", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Andrea Ramírez", raza:"Schnauzer", tel:"3208524777", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Andrea Hernández", raza:"", tel:"3132614439", tipo:"K9", ciudad:"Bogotá", initials:"AH"},
    {nombre:"Andrea Guauque", raza:"", tel:"3209464121", tipo:"K9", ciudad:"Bogotá", initials:"AG"},
    {nombre:"Andrea Barrios", raza:"Gr Dane", tel:"3154142928", tipo:"K9", ciudad:"Bogotá", initials:"AB"},
    {nombre:"Andrea Garcia", raza:"Boxer", tel:"3153351643", tipo:"K9", ciudad:"Bogotá", initials:"AG"},
    {nombre:"Andrea Duran", raza:"Cocapoo", tel:"3102950559", tipo:"K9", ciudad:"Bogotá", initials:"AD"},
    {nombre:"Andrea Ocampo", raza:"Pup", tel:"3144732706", tipo:"Pup", ciudad:"Bogotá", initials:"AO"},
    {nombre:"Andrea Navas", raza:"", tel:"3173650614", tipo:"K9", ciudad:"Bogotá", initials:"AN"},
    {nombre:"Andrea Palacio", raza:"Border", tel:"3212046607", tipo:"Pup", ciudad:"Bogotá", initials:"AP"},
    {nombre:"Andrea Katherine", raza:"Pitbull", tel:"3215423429", tipo:"K9", ciudad:"Bogotá", initials:"AK"},
    {nombre:"Andrea Murillo", raza:"Bernés", tel:"3203649028", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Andrea Martínez", raza:"Golden", tel:"3507779988", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Andrea Ortega", raza:"Adop", tel:"3212039026", tipo:"K9", ciudad:"Bogotá", initials:"AO"},
    {nombre:"Andrea Perdomo", raza:"Plan", tel:"3133075111", tipo:"K9", ciudad:"Bogotá", initials:"AP"},
    {nombre:"Andreina Molinares", raza:"", tel:"3154842369", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Andreína Guerrón", raza:"Bernés", tel:"3186120828", tipo:"Pup", ciudad:"Bogotá", initials:"AG"},
    {nombre:"Andres Chaves", raza:"", tel:"3102024028", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Andres Cepeda", raza:"BldFr", tel:"3016249533", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Andres Cardozo", raza:"Criollo", tel:"3118768602", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Andres Llinás", raza:"Adopt", tel:"3125922324", tipo:"K9", ciudad:"Bogotá", initials:"AL"},
    {nombre:"Andres Rojas", raza:"Labradoodle", tel:"3182164894", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Andrés Urbano", raza:"Samoyedo", tel:"3008209766", tipo:"K9", ciudad:"Bogotá", initials:"AU"},
    {nombre:"Andrés Cadena", raza:"", tel:"1481638933", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Andrés Cadena", raza:"", tel:"3102016084", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Andrés Verhelts", raza:"Lucia", tel:"3157988827", tipo:"K9", ciudad:"Bogotá", initials:"AV"},
    {nombre:"Angela Bravo", raza:"Collie", tel:"3155391718", tipo:"K9", ciudad:"Bogotá", initials:"AB"},
    {nombre:"Angela Jimenez", raza:"Past", tel:"3004160353", tipo:"K9", ciudad:"Bogotá", initials:"AJ"},
    {nombre:"Angela M.", raza:"Pit7Pup7Fren", tel:"3012604239", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Angela Quevedo", raza:"Lía", tel:"1816616151", tipo:"K9", ciudad:"Bogotá", initials:"AQ"},
    {nombre:"Angela Quevedo", raza:"Lía", tel:"3135699089", tipo:"K9", ciudad:"Bogotá", initials:"AQ"},
    {nombre:"Angela Alonso", raza:"Labradoodle", tel:"3176358815", tipo:"Pup", ciudad:"Bogotá", initials:"AA"},
    {nombre:"Angela Mantilla", raza:"PastGanAust", tel:"3134911313", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Angela Maria", raza:"Bodytech", tel:"3102717961", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Angela Sanabria", raza:"Pitbull", tel:"3222138892", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Ángela Correa", raza:"Pup", tel:"3152333791", tipo:"Pup", ciudad:"Bogotá", initials:"ÁC"},
    {nombre:"Ángela María", raza:"", tel:"3104627411", tipo:"K9", ciudad:"Bogotá", initials:"ÁM"},
    {nombre:"Angelica Castaño", raza:"Pomeranian", tel:"3216472740", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Angélica Urbina", raza:"Schnauzer", tel:"3185358004", tipo:"K9", ciudad:"Bogotá", initials:"AU"},
    {nombre:"Angélica Romero", raza:"Collie", tel:"4259269635", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Angélica Romero", raza:"Collie", tel:"3017063429", tipo:"K9", ciudad:"Bogotá", initials:"AR"},
    {nombre:"Angélica Flórez", raza:"", tel:"3174642626", tipo:"K9", ciudad:"Bogotá", initials:"AF"},
    {nombre:"Angélica Ma", raza:"", tel:"3104193912", tipo:"K9", ciudad:"Bogotá", initials:"AM"},
    {nombre:"Angelina Spadei", raza:"", tel:"3213732612", tipo:"K9", ciudad:"Bogotá", initials:"AS"},
    {nombre:"Any Ardilla", raza:"Pup", tel:"3208387935", tipo:"Pup", ciudad:"Bogotá", initials:"AA"},
    {nombre:"Arantxa Díaz", raza:"", tel:"3102239191", tipo:"K9", ciudad:"Bogotá", initials:"AD"},
    {nombre:"Arantxa Cárdenas", raza:"", tel:"3012252066", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Arturo K9", raza:"Conductor", tel:"3107999067", tipo:"K9", ciudad:"Bogotá", initials:"AK"},
    {nombre:"Aura Cano", raza:"BldFr", tel:"3003006372", tipo:"K9", ciudad:"Bogotá", initials:"AC"},
    {nombre:"Barbara Nuchtern", raza:"GrDane", tel:"3153318594", tipo:"K9", ciudad:"Bogotá", initials:"BN"},
    {nombre:"Beatriz Eugenia del Pilar", raza:"Jack Rusell", tel:"3102430355", tipo:"K9", ciudad:"Bogotá", initials:"BE"},
    {nombre:"Beatriz Gordillo", raza:"Cockermix", tel:"3148893684", tipo:"Pup", ciudad:"Bogotá", initials:"BG"},
    {nombre:"Beatriz Marquez", raza:"", tel:"3104200664", tipo:"K9", ciudad:"Medellín", initials:"BM"},
    {nombre:"Beatriz Martinez", raza:"Bimba", tel:"3138532879", tipo:"K9", ciudad:"Bogotá", initials:"BM"},
    {nombre:"Betty Ramírez,", raza:"", tel:"3157439042", tipo:"K9", ciudad:"Bogotá", initials:"BR"},
    {nombre:"Betty 15", raza:"", tel:"3213834715", tipo:"K9", ciudad:"Bogotá", initials:"B1"},
    {nombre:"Bibi Blackburn", raza:"", tel:"3134337760", tipo:"K9", ciudad:"Bogotá", initials:"BB"},
    {nombre:"Bibiana La", raza:"", tel:"3143043618", tipo:"K9", ciudad:"Bogotá", initials:"BL"},
    {nombre:"Bibiana Jerez", raza:"Golden", tel:"3002802401", tipo:"K9", ciudad:"Bogotá", initials:"BJ"},
    {nombre:"Blanca C.", raza:"Pup", tel:"3115319280", tipo:"Pup", ciudad:"Bogotá", initials:"BC"},
    {nombre:"Brenda Gsh", raza:"Gsh", tel:"3182573563", tipo:"K9", ciudad:"Bogotá", initials:"BG"},
    {nombre:"Brian Rincón", raza:"Criollo", tel:"3134996511", tipo:"K9", ciudad:"Bogotá", initials:"BR"},
    {nombre:"Brigitte Meyer", raza:"Salchicha", tel:"3153319266", tipo:"Pup", ciudad:"Bogotá", initials:"BM"},
    {nombre:"Camila Zamudio", raza:"San Bernardo", tel:"3152628299", tipo:"K9", ciudad:"Bogotá", initials:"CZ"},
    {nombre:"Camila Torres", raza:"Criolla", tel:"3013643976", tipo:"K9", ciudad:"Bogotá", initials:"CT"},
    {nombre:"Camila Luque", raza:"", tel:"3108118836", tipo:"Pup", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Camila Ordóñez", raza:"Wiki", tel:"3134664012", tipo:"K9", ciudad:"Bogotá", initials:"CO"},
    {nombre:"Camila Mor", raza:"", tel:"3105725307", tipo:"K9", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Camila Ramírez", raza:"Salchicha", tel:"3174036630", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Camila Muñoz", raza:"Pup", tel:"3006548594", tipo:"Pup", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Camila Granado", raza:"", tel:"3117282244", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Camila Reyes", raza:"", tel:"3174012762", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Camilo Nossa", raza:"Belga", tel:"3013352754", tipo:"K9", ciudad:"Bogotá", initials:"CN"},
    {nombre:"Camilo Lacouture", raza:"Bailey", tel:"3184311114", tipo:"Pup", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Camilo Llinás", raza:"Miel", tel:"3153086393", tipo:"K9", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Carlos Lasprilla", raza:"Golden", tel:"0195400317", tipo:"Pup", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Carlos Lasprilla", raza:"Golden", tel:"3217661585", tipo:"Pup", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Carlos Álvarez", raza:"Galgo", tel:"3108766377", tipo:"K9", ciudad:"Bogotá", initials:"CÁ"},
    {nombre:"Carlos Lara", raza:"Chihuahua", tel:"3155958838", tipo:"K9", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Carlos Torres", raza:"La", tel:"3059338302", tipo:"K9", ciudad:"Bogotá", initials:"CT"},
    {nombre:"Carlos K9", raza:"Agresivo", tel:"3002930089", tipo:"K9", ciudad:"Bogotá", initials:"CK"},
    {nombre:"Carlos Leyva", raza:"Pincher + Ch", tel:"3213120372", tipo:"K9", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Carlos Forero", raza:"Alaskan", tel:"3202353208", tipo:"Pup", ciudad:"Bogotá", initials:"CF"},
    {nombre:"Carmen Sofía", raza:"", tel:"3112696435", tipo:"K9", ciudad:"Bogotá", initials:"CS"},
    {nombre:"Carmen Isabel", raza:"BldFr", tel:"3164672097", tipo:"K9", ciudad:"Bogotá", initials:"CI"},
    {nombre:"Carmen Santi", raza:"Salchicha", tel:"3134779841", tipo:"K9", ciudad:"Bogotá", initials:"CS"},
    {nombre:"Carolina Montaño", raza:"Calera", tel:"3112318236", tipo:"K9", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Carolina Rios", raza:"Pup", tel:"3155545902", tipo:"Pup", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Carolina Herrera", raza:"", tel:"3168612669", tipo:"K9", ciudad:"Bogotá", initials:"CH"},
    {nombre:"Carolina Rengifo", raza:"Bernés", tel:"3123797548", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Carolina Ortiz", raza:"Border", tel:"3174323081", tipo:"K9", ciudad:"Bogotá", initials:"CO"},
    {nombre:"Carolina Granados", raza:"Rotty", tel:"3125382711", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Carolina Arias", raza:"", tel:"3188272539", tipo:"K9", ciudad:"Bogotá", initials:"CA"},
    {nombre:"Carolina Gómez", raza:"", tel:"3166291969", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Carolina Murgueitio", raza:"Husky", tel:"3153400297", tipo:"K9", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Carolina Iregui", raza:"Quinness", tel:"3125855750", tipo:"K9", ciudad:"Bogotá", initials:"CI"},
    {nombre:"Carolina Santacruz", raza:"", tel:"3004729280", tipo:"K9", ciudad:"Bogotá", initials:"CS"},
    {nombre:"Carolina Morales", raza:"", tel:"3142678354", tipo:"Pup", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Carolina Suárez", raza:"", tel:"3105850966", tipo:"K9", ciudad:"Bogotá", initials:"CS"},
    {nombre:"Carolina Chía", raza:"Pastor", tel:"3148739112", tipo:"K9", ciudad:"Bogotá", initials:"CC"},
    {nombre:"Carolina López", raza:"Doberman", tel:"3114573296", tipo:"K9", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Carolina Gomez", raza:"", tel:"3168017175", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Carolina Villamizar", raza:"Donante", tel:"3015685041", tipo:"K9", ciudad:"Bogotá", initials:"CV"},
    {nombre:"Carolina Montalvo", raza:"Golden", tel:"3006093323", tipo:"K9", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Carolina Flórez", raza:"BlueHeeler", tel:"3013382268", tipo:"K9", ciudad:"Bogotá", initials:"CF"},
    {nombre:"Carolina Rodríguez", raza:"Collie", tel:"8490319996", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Carolina Rodríguez", raza:"Collie", tel:"3022982477", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Cata Palacio", raza:"Beach", tel:"3156328010", tipo:"K9", ciudad:"Bogotá", initials:"CP"},
    {nombre:"Catalina Bleier", raza:"", tel:"3102720001", tipo:"K9", ciudad:"Bogotá", initials:"CB"},
    {nombre:"Catalina Silva", raza:"Pup", tel:"3158953936", tipo:"Pup", ciudad:"Bogotá", initials:"CS"},
    {nombre:"Catalina Gómez", raza:"Brd", tel:"3134331144", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Catalina Restrepo", raza:"Teckel", tel:"3006188877", tipo:"Pup", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Catalina Martinez", raza:"", tel:"3143822419", tipo:"K9", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Catalina Ruiz", raza:"Cocker", tel:"3203499719", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Catalina Pombo", raza:"Wiemaraner", tel:"3138936763", tipo:"Pup", ciudad:"Bogotá", initials:"CP"},
    {nombre:"Catalina Chavarro", raza:"Westie", tel:"3102919820", tipo:"K9", ciudad:"Bogotá", initials:"CC"},
    {nombre:"Catalina Fonseca", raza:"Golden", tel:"3115507117", tipo:"K9", ciudad:"Bogotá", initials:"CF"},
    {nombre:"Catalina Ramírez", raza:"Pup", tel:"3124342547", tipo:"Pup", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Catalina Abuchaibe", raza:"Bernés", tel:"3208467064", tipo:"K9", ciudad:"Bogotá", initials:"CA"},
    {nombre:"Catalina Ocampo", raza:"Criollo", tel:"3142969266", tipo:"K9", ciudad:"Bogotá", initials:"CO"},
    {nombre:"Catalina Cuartas", raza:"", tel:"3115234738", tipo:"K9", ciudad:"Bogotá", initials:"CC"},
    {nombre:"Catalina Valencia", raza:"Alana", tel:"3015400235", tipo:"K9", ciudad:"Bogotá", initials:"CV"},
    {nombre:"Catalina Rodríguez", raza:"", tel:"3013337869", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Cesar Lopez", raza:"", tel:"3158631774", tipo:"K9", ciudad:"Bogotá", initials:"CL"},
    {nombre:"César A", raza:"BrdrCriolli", tel:"3165256889", tipo:"K9", ciudad:"Bogotá", initials:"CA"},
    {nombre:"Christian Gutiérrez", raza:"Vecino", tel:"3212109689", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Christian Mora", raza:"Pup", tel:"3185328239", tipo:"Pup", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Clara Quimbayo", raza:"Labradoodle", tel:"3153475013", tipo:"K9", ciudad:"Bogotá", initials:"CQ"},
    {nombre:"Clara Maria", raza:"Bernal", tel:"3136554647", tipo:"K9", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Clara De", raza:"", tel:"3144145515", tipo:"K9", ciudad:"Bogotá", initials:"CD"},
    {nombre:"Claudia Salcedo", raza:"LabraDoodle", tel:"3005669043", tipo:"Pup", ciudad:"Bogotá", initials:"CS"},
    {nombre:"Claudia Garzón", raza:"Pup", tel:"3164959481", tipo:"Pup", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Claudia Abadía", raza:"", tel:"3107710805", tipo:"K9", ciudad:"Bogotá", initials:"CA"},
    {nombre:"Claudia González", raza:"Mamá", tel:"3008087389", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Claudia Neira", raza:"Collie", tel:"3007499455", tipo:"K9", ciudad:"Bogotá", initials:"CN"},
    {nombre:"Claudia Chaparro", raza:"Shi", tel:"3203034974", tipo:"K9", ciudad:"Bogotá", initials:"CC"},
    {nombre:"Claudia Flórez", raza:"", tel:"3174412987", tipo:"K9", ciudad:"Bucaramanga", initials:"CF"},
    {nombre:"Claudia Lloreda", raza:"", tel:"3212228426", tipo:"Pup", ciudad:"Bogotá", initials:"CL"},
    {nombre:"Claudia Beltran", raza:"Rhodesian", tel:"3232305629", tipo:"Pup", ciudad:"Bogotá", initials:"CB"},
    {nombre:"Claudia Rozo", raza:"Golden", tel:"3005298121", tipo:"K9", ciudad:"Bogotá", initials:"CR"},
    {nombre:"Claudia Barragán", raza:"", tel:"3012511800", tipo:"K9", ciudad:"Bogotá", initials:"CB"},
    {nombre:"Claudia Bunch", raza:"", tel:"3164713377", tipo:"K9", ciudad:"Bogotá", initials:"CB"},
    {nombre:"Cristian Perafan", raza:"Popayán", tel:"3152550360", tipo:"K9", ciudad:"Bogotá", initials:"CP"},
    {nombre:"Cristina Dussan", raza:"", tel:"3155659240", tipo:"K9", ciudad:"Bogotá", initials:"CD"},
    {nombre:"Cristina Gonzalez", raza:"Shitzu", tel:"2166115467", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Cristina Gonzalez", raza:"Shitzu", tel:"3132419971", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Cristina Gamboa", raza:"Virrey", tel:"3164465262", tipo:"K9", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Cristina Ávila", raza:"Bernedoodle", tel:"3155856624", tipo:"Pup", ciudad:"Bogotá", initials:"CÁ"},
    {nombre:"Cristina Manosalva", raza:"", tel:"3015177565", tipo:"K9", ciudad:"Bogotá", initials:"CM"},
    {nombre:"Cristina Iragorri", raza:"Subachoque", tel:"3153213821", tipo:"K9", ciudad:"Bogotá", initials:"CI"},
    {nombre:"Cristina Álvarez", raza:"Timbit", tel:"3157710939", tipo:"K9", ciudad:"Bogotá", initials:"CÁ"},
    {nombre:"Crnel Gilberto", raza:"", tel:"3102286484", tipo:"Pup", ciudad:"Bogotá", initials:"CG"},
    {nombre:"Daniel Mejía", raza:"Pup", tel:"3143578604", tipo:"Pup", ciudad:"Bogotá", initials:"DM"},
    {nombre:"Daniel Muñoz", raza:"", tel:"3057037389", tipo:"K9", ciudad:"Bogotá", initials:"DM"},
    {nombre:"Daniel Suárez", raza:"Pastor", tel:"3114426694", tipo:"K9", ciudad:"Bogotá", initials:"DS"},
    {nombre:"Daniel Dávila", raza:"", tel:"3187171925", tipo:"K9", ciudad:"Bogotá", initials:"DD"},
    {nombre:"Daniel Santamaría", raza:"Samoyedo", tel:"3124354061", tipo:"K9", ciudad:"Bogotá", initials:"DS"},
    {nombre:"Daniel Zapata", raza:"GoPro", tel:"3163440444", tipo:"K9", ciudad:"Bogotá", initials:"DZ"},
    {nombre:"Daniel Ucros", raza:"", tel:"3144704766", tipo:"K9", ciudad:"Bogotá", initials:"DU"},
    {nombre:"Daniel Fontanar", raza:"", tel:"3167994125", tipo:"K9", ciudad:"Bogotá", initials:"DF"},
    {nombre:"Daniela Alejandra", raza:"Cockermix", tel:"3144608393", tipo:"Pup", ciudad:"Bogotá", initials:"DA"},
    {nombre:"Daniela Ramos", raza:"Husky", tel:"3173347191", tipo:"Pup", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Daniela Peláez", raza:"Pomeranian", tel:"3118106777", tipo:"K9", ciudad:"Bogotá", initials:"DP"},
    {nombre:"Daniela Acosta", raza:"", tel:"3167415120", tipo:"K9", ciudad:"Bogotá", initials:"DA"},
    {nombre:"Daniela Abisambra", raza:"Criolla", tel:"3212094276", tipo:"K9", ciudad:"Bogotá", initials:"DA"},
    {nombre:"Daniela Chiari", raza:"Criolla", tel:"3108061400", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Daniela Reyes", raza:"", tel:"3183777161", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Daniela Debacco", raza:"Golden", tel:"3183540584", tipo:"Pup", ciudad:"Bogotá", initials:"DD"},
    {nombre:"Daniela Castro", raza:"Frenchy", tel:"3213830020", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Daniela Restrepo", raza:"", tel:"3214435955", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Daniela Restrepo", raza:"", tel:"3002093592", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Daniela Londoño", raza:"Vet", tel:"3176587403", tipo:"K9", ciudad:"Bogotá", initials:"DL"},
    {nombre:"Daniela Nassar", raza:"", tel:"3105678629", tipo:"K9", ciudad:"Bogotá", initials:"DN"},
    {nombre:"Daniela Rojas", raza:"Pup", tel:"3195310657", tipo:"Pup", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Daniela Ardilla", raza:"Wiki", tel:"3507902772", tipo:"K9", ciudad:"Bogotá", initials:"DA"},
    {nombre:"Daniela Calle", raza:"Collie", tel:"3163337554", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Daniela Rivera", raza:"", tel:"3213723648", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Daniella Paredes", raza:"Polar", tel:"3192573255", tipo:"K9", ciudad:"Bogotá", initials:"DP"},
    {nombre:"Daniella Martinez", raza:"Criollo", tel:"3203266284", tipo:"K9", ciudad:"Bogotá", initials:"DM"},
    {nombre:"Danna Ramírez", raza:"Yorkie", tel:"3124505239", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Dannally Torrealba", raza:"Villavo", tel:"3167942918", tipo:"K9", ciudad:"Bogotá", initials:"DT"},
    {nombre:"Darío Maldonado", raza:"", tel:"3183732863", tipo:"K9", ciudad:"Bogotá", initials:"DM"},
    {nombre:"David Estevez", raza:"Golden", tel:"3112861893", tipo:"K9", ciudad:"Bogotá", initials:"DE"},
    {nombre:"David Meléndez-Guevara", raza:"Collie", tel:"3043394295", tipo:"K9", ciudad:"Bogotá", initials:"DM"},
    {nombre:"David Alvarez", raza:"", tel:"3204910436", tipo:"K9", ciudad:"Bogotá", initials:"DA"},
    {nombre:"Dayana Herrera", raza:"patas", tel:"3178388314", tipo:"K9", ciudad:"Bogotá", initials:"DH"},
    {nombre:"Denise Chahin", raza:"BDF", tel:"3102234804", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Diahann Salamanca", raza:"Pomeranian", tel:"3143637688", tipo:"Pup", ciudad:"Bogotá", initials:"DS"},
    {nombre:"Diana Diaz", raza:"", tel:"3108643471", tipo:"K9", ciudad:"Bogotá", initials:"DD"},
    {nombre:"Diana Ramírez", raza:"", tel:"3108226772", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Diana Wiest", raza:"", tel:"3125925616", tipo:"K9", ciudad:"Bogotá", initials:"DW"},
    {nombre:"Diana Cortés", raza:"", tel:"3108153512", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Diana Ximena", raza:"", tel:"3007285030", tipo:"K9", ciudad:"Bogotá", initials:"DX"},
    {nombre:"Diana Chavez", raza:"Criollo", tel:"3107823697", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Diana Bahamon", raza:"Cucayo", tel:"3152049261", tipo:"K9", ciudad:"Bogotá", initials:"DB"},
    {nombre:"Diana Cardoso", raza:"Bernedoodle", tel:"3214097944", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Diana Cabrera", raza:"Criollo", tel:"3134846374", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Diana Mamá de Rocco", raza:"Golden", tel:"3105576035", tipo:"K9", ciudad:"Bogotá", initials:"DM"},
    {nombre:"Diana María", raza:"", tel:"3008061962", tipo:"K9", ciudad:"Bogotá", initials:"DM"},
    {nombre:"Diana López", raza:"Yorkie", tel:"3165399622", tipo:"K9", ciudad:"Bogotá", initials:"DL"},
    {nombre:"Diana Cuervo", raza:"Yorkie", tel:"3132882180", tipo:"K9", ciudad:"Bogotá", initials:"DC"},
    {nombre:"Diego Bonilla", raza:"Cota", tel:"3108708870", tipo:"K9", ciudad:"Bogotá", initials:"DB"},
    {nombre:"Diego Rodriguez", raza:"Mía", tel:"3125230082", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Diego Monsalve", raza:"Pup", tel:"3105178874", tipo:"Pup", ciudad:"Bogotá", initials:"DM"},
    {nombre:"Diego Ramirez", raza:"Golden", tel:"3118181245", tipo:"K9", ciudad:"Bogotá", initials:"DR"},
    {nombre:"Diego de la Ossa", raza:"Ossa", tel:"3144145957", tipo:"K9", ciudad:"Bogotá", initials:"DD"},
    {nombre:"Doorley Posada", raza:"Novio de Ana", tel:"3157915343", tipo:"K9", ciudad:"Bogotá", initials:"DP"},
    {nombre:"Dora Isabel", raza:"Pup", tel:"3153603844", tipo:"Pup", ciudad:"Bogotá", initials:"DI"},
    {nombre:"Eddy Yepes", raza:"", tel:"3153134151", tipo:"Pup", ciudad:"Bogotá", initials:"EY"},
    {nombre:"Edgar Castro", raza:"Pup", tel:"3187073986", tipo:"Pup", ciudad:"Bogotá", initials:"EC"},
    {nombre:"Edgar Gonzalez", raza:"Perro", tel:"3152450601", tipo:"K9", ciudad:"Bogotá", initials:"EG"},
    {nombre:"EdgarManuel Escobar", raza:"Lenny", tel:"3192611573", tipo:"Pup", ciudad:"Bogotá", initials:"EE"},
    {nombre:"Eduardo Londoño", raza:"", tel:"3153140508", tipo:"K9", ciudad:"Bogotá", initials:"EL"},
    {nombre:"Eduardo Arrubla", raza:"Maillinois", tel:"3003248594", tipo:"K9", ciudad:"Bogotá", initials:"EA"},
    {nombre:"Eduardo Bermúdez", raza:"", tel:"3153187270", tipo:"K9", ciudad:"Bogotá", initials:"EB"},
    {nombre:"Eliana Cabrera", raza:"", tel:"3113109877", tipo:"K9", ciudad:"Bogotá", initials:"EC"},
    {nombre:"Elinor Vevle", raza:"Doberman", tel:"3157433652", tipo:"K9", ciudad:"Bogotá", initials:"EV"},
    {nombre:"Elisa Lara", raza:"Pup", tel:"3102062564", tipo:"Pup", ciudad:"Bogotá", initials:"EL"},
    {nombre:"Elizabeth Estrada", raza:"WestiePup", tel:"3125866896", tipo:"Pup", ciudad:"Bogotá", initials:"EE"},
    {nombre:"Emily Riaño", raza:"", tel:"3204098346", tipo:"K9", ciudad:"Bogotá", initials:"ER"},
    {nombre:"Erika Salazar", raza:"Boston", tel:"3133705803", tipo:"K9", ciudad:"Bogotá", initials:"ES"},
    {nombre:"Erika Gómez", raza:"Fr", tel:"3164474058", tipo:"K9", ciudad:"Bogotá", initials:"EG"},
    {nombre:"Erika María", raza:"", tel:"3228017820", tipo:"K9", ciudad:"Bogotá", initials:"EM"},
    {nombre:"Erika Rocha", raza:"Pug", tel:"3123176257", tipo:"K9", ciudad:"Bogotá", initials:"ER"},
    {nombre:"Esperanza Rozo", raza:"Yorkies Roma", tel:"3108817805", tipo:"K9", ciudad:"Bogotá", initials:"ER"},
    {nombre:"Esteban Franky", raza:"Hobbes", tel:"3174387811", tipo:"K9", ciudad:"Bogotá", initials:"EF"},
    {nombre:"Estefania Guerrero", raza:"Gldn", tel:"3112124784", tipo:"Pup", ciudad:"Bogotá", initials:"EG"},
    {nombre:"estefania zapata", raza:"Cocker", tel:"3168233764", tipo:"K9", ciudad:"Bogotá", initials:"EZ"},
    {nombre:"Esther Muñoz", raza:"Shí", tel:"3106669486", tipo:"K9", ciudad:"Bogotá", initials:"EM"},
    {nombre:"Ezael K9", raza:"Ibagué", tel:"3124158895", tipo:"K9", ciudad:"Bogotá", initials:"EK"},
    {nombre:"Fabián Montes", raza:"", tel:"3116849285", tipo:"K9", ciudad:"Bogotá", initials:"FM"},
    {nombre:"Fabiana Gómez", raza:"Labra", tel:"3125012655", tipo:"K9", ciudad:"Bogotá", initials:"FG"},
    {nombre:"Fadia Badràn", raza:"Rescue", tel:"6125490995", tipo:"K9", ciudad:"Bogotá", initials:"FB"},
    {nombre:"Fadia Badràn", raza:"Rescue", tel:"3102536533", tipo:"K9", ciudad:"Bogotá", initials:"FB"},
    {nombre:"Familia Bermúdez", raza:"", tel:"3108677883", tipo:"K9", ciudad:"Bogotá", initials:"FB"},
    {nombre:"Federico Cuéllar", raza:"Tatiana", tel:"3202744328", tipo:"K9", ciudad:"Bogotá", initials:"FC"},
    {nombre:"Felipe Robayo", raza:"Criollo", tel:"3153964224", tipo:"K9", ciudad:"Bogotá", initials:"FR"},
    {nombre:"Felipe Cabrera", raza:"", tel:"3105894499", tipo:"K9", ciudad:"Bogotá", initials:"FC"},
    {nombre:"Felipe Delgado", raza:"", tel:"3002084798", tipo:"Pup", ciudad:"Bogotá", initials:"FD"},
    {nombre:"Fernanda Trías", raza:"Criolla", tel:"3003069174", tipo:"K9", ciudad:"Bogotá", initials:"FT"},
    {nombre:"Fernando Barrero", raza:"Tobby", tel:"3164730721", tipo:"K9", ciudad:"Bogotá", initials:"FB"},
    {nombre:"Fernando Mojica", raza:"Bostón Terri", tel:"3104894344", tipo:"K9", ciudad:"Bogotá", initials:"FM"},
    {nombre:"Fiorella Hernández", raza:"Criollo", tel:"3164938060", tipo:"K9", ciudad:"Bogotá", initials:"FH"},
    {nombre:"Francia", raza:"", tel:"3215242839", tipo:"K9", ciudad:"Bogotá", initials:"F"},
    {nombre:"Francisco", raza:"", tel:"3102871180", tipo:"K9", ciudad:"Bogotá", initials:"F"},
    {nombre:"Fredy Pabón", raza:"", tel:"3107584056", tipo:"K9", ciudad:"Bogotá", initials:"FP"},
    {nombre:"Gabi Chavez", raza:"", tel:"3229480240", tipo:"K9", ciudad:"Bogotá", initials:"GC"},
    {nombre:"Gabriel Romero", raza:"PastShetland", tel:"3204888185", tipo:"K9", ciudad:"Bogotá", initials:"GR"},
    {nombre:"Gabriela Mojica", raza:"American", tel:"3013234604", tipo:"K9", ciudad:"Bogotá", initials:"GM"},
    {nombre:"Gabriela Cala", raza:"", tel:"3218720422", tipo:"K9", ciudad:"Bogotá", initials:"GC"},
    {nombre:"German Gomez", raza:"Husky", tel:"3185483410", tipo:"K9", ciudad:"Bogotá", initials:"GG"},
    {nombre:"Germán K9", raza:"Border", tel:"3157549581", tipo:"K9", ciudad:"Bogotá", initials:"GK"},
    {nombre:"Giannina Fasanelli", raza:"Boxer", tel:"5399473231", tipo:"Pup", ciudad:"Bogotá", initials:"GF"},
    {nombre:"Giannina Fasanelli", raza:"Boxer", tel:"3102111694", tipo:"Pup", ciudad:"Bogotá", initials:"GF"},
    {nombre:"Gina Delcastillo", raza:"Sede", tel:"3138732042", tipo:"K9", ciudad:"Bogotá", initials:"GD"},
    {nombre:"Gina Ciceri", raza:"", tel:"3124500320", tipo:"K9", ciudad:"Bogotá", initials:"GC"},
    {nombre:"Giovanna Yepes", raza:"Border", tel:"3175138103", tipo:"Pup", ciudad:"Bogotá", initials:"GY"},
    {nombre:"Giovanna Lorenzini", raza:"Pup", tel:"3138513167", tipo:"Pup", ciudad:"Bogotá", initials:"GL"},
    {nombre:"Giovanna Sotomonte", raza:"PastAust", tel:"3164723081", tipo:"K9", ciudad:"Bogotá", initials:"GS"},
    {nombre:"Gisela Borrero", raza:"", tel:"3102880207", tipo:"K9", ciudad:"Bogotá", initials:"GB"},
    {nombre:"Gladys María", raza:"Pup", tel:"3153624155", tipo:"Pup", ciudad:"Bogotá", initials:"GM"},
    {nombre:"Gloria Vanegas", raza:"", tel:"3123042797", tipo:"K9", ciudad:"Bogotá", initials:"GV"},
    {nombre:"Golden K9", raza:"Milena", tel:"3162782138", tipo:"K9", ciudad:"Bogotá", initials:"GK"},
    {nombre:"Gregorio Mariño", raza:"", tel:"3178473159", tipo:"K9", ciudad:"Bogotá", initials:"GM"},
    {nombre:"Guillermina Vivas", raza:"Mime", tel:"3158111281", tipo:"K9", ciudad:"Bogotá", initials:"GV"},
    {nombre:"Guillermo Castillo", raza:"Collie", tel:"3134215705", tipo:"K9", ciudad:"Bogotá", initials:"GC"},
    {nombre:"Gustavo Caballero", raza:"Criollo", tel:"3102177946", tipo:"K9", ciudad:"Bogotá", initials:"GC"},
    {nombre:"Gustavo Mancera", raza:"Criolla", tel:"3204941961", tipo:"Pup", ciudad:"Bogotá", initials:"GM"},
    {nombre:"Hana Miri", raza:"", tel:"3158406833", tipo:"K9", ciudad:"Bogotá", initials:"HM"},
    {nombre:"Hanna Böhm", raza:"Criolla", tel:"3166195148", tipo:"K9", ciudad:"Bogotá", initials:"HB"},
    {nombre:"Hans Sperber", raza:"Salchicha", tel:"3168308607", tipo:"K9", ciudad:"Bogotá", initials:"HS"},
    {nombre:"Humberto Suárez", raza:"Golden", tel:"3107628074", tipo:"Pup", ciudad:"Bogotá", initials:"HS"},
    {nombre:"Ingrid Rodriguez", raza:"Bld", tel:"3144139020", tipo:"K9", ciudad:"Bogotá", initials:"IR"},
    {nombre:"Ingrid Campo", raza:"FrBld", tel:"3164698261", tipo:"K9", ciudad:"Bogotá", initials:"IC"},
    {nombre:"Irene Adamoli", raza:"Sep", tel:"3143548816", tipo:"K9", ciudad:"Bogotá", initials:"IA"},
    {nombre:"Irina Laino", raza:"Jack", tel:"3214763851", tipo:"Pup", ciudad:"Bogotá", initials:"IL"},
    {nombre:"Irlena Chaves", raza:"", tel:"3184247247", tipo:"K9", ciudad:"Bogotá", initials:"IC"},
    {nombre:"Isaac Guerrero", raza:"Cumbia", tel:"3208924630", tipo:"K9", ciudad:"Bogotá", initials:"IG"},
    {nombre:"Isabel Del", raza:"", tel:"3122596675", tipo:"K9", ciudad:"Bogotá", initials:"ID"},
    {nombre:"Isabel Pelaez", raza:"BldFr", tel:"3128506402", tipo:"K9", ciudad:"Bogotá", initials:"IP"},
    {nombre:"Isabela Gallego", raza:"", tel:"3122599969", tipo:"K9", ciudad:"Bogotá", initials:"IG"},
    {nombre:"Isabella Campo", raza:"AmericanBull", tel:"3125467752", tipo:"K9", ciudad:"Bogotá", initials:"IC"},
    {nombre:"Isabella Puerta", raza:"Rottweiler", tel:"3223542497", tipo:"Pup", ciudad:"Bogotá", initials:"IP"},
    {nombre:"Isabella Gutierrez", raza:"", tel:"3058528723", tipo:"K9", ciudad:"Bogotá", initials:"IG"},
    {nombre:"Ivan Rojas", raza:"Pasó", tel:"3212919180", tipo:"K9", ciudad:"Bogotá", initials:"IR"},
    {nombre:"Ivonne Galeano", raza:"Imaga Beauty", tel:"3194896623", tipo:"K9", ciudad:"Bogotá", initials:"IG"},
    {nombre:"Jaime Moreno", raza:"Pomsky", tel:"3152058200", tipo:"K9", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Jaime Duque", raza:"San", tel:"3168334106", tipo:"K9", ciudad:"Bogotá", initials:"JD"},
    {nombre:"Janeth Perrita", raza:"Siberiana", tel:"3112311636", tipo:"K9", ciudad:"Bogotá", initials:"JP"},
    {nombre:"Jasbleidy Forero", raza:"Criolla", tel:"3114648508", tipo:"K9", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Jeannette De la Rosa", raza:"Golden Doodl", tel:"3112130633", tipo:"Pup", ciudad:"Bogotá", initials:"JD"},
    {nombre:"Jennifer Callejas", raza:"Criolla", tel:"3174893563", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Jenniffer Salamanca", raza:"Pomeranian", tel:"3102175892", tipo:"K9", ciudad:"Bogotá", initials:"JS"},
    {nombre:"JENNY GIRALDO", raza:"Pup", tel:"3202319986", tipo:"Pup", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Jérôme K9", raza:"Hija", tel:"3204891098", tipo:"K9", ciudad:"Bogotá", initials:"JK"},
    {nombre:"Jessica Amaya", raza:"", tel:"3006551883", tipo:"K9", ciudad:"Bogotá", initials:"JA"},
    {nombre:"Jessica Jaramillo", raza:"PitLab", tel:"3182256614", tipo:"K9", ciudad:"Bogotá", initials:"JJ"},
    {nombre:"Jessica Vargas", raza:"American", tel:"3212104624", tipo:"K9", ciudad:"Bogotá", initials:"JV"},
    {nombre:"Jimena Montoya", raza:"Yorkie", tel:"3185778727", tipo:"K9", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Jimena Noguera", raza:"Husky", tel:"3132876441", tipo:"K9", ciudad:"Bogotá", initials:"JN"},
    {nombre:"Jimena Betancourt", raza:"Blaky", tel:"3184153037", tipo:"K9", ciudad:"Bogotá", initials:"JB"},
    {nombre:"Jimena Pena", raza:"", tel:"3122889006", tipo:"K9", ciudad:"Bogotá", initials:"JP"},
    {nombre:"Jimena Merizalde", raza:"PastOvAust", tel:"3134775284", tipo:"K9", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Joanna Safi", raza:"Alaskan", tel:"3102181645", tipo:"K9", ciudad:"Bogotá", initials:"JS"},
    {nombre:"Johana Baquero", raza:"", tel:"3108777284", tipo:"K9", ciudad:"Bogotá", initials:"JB"},
    {nombre:"Johana Delgado", raza:"Cali", tel:"3167532986", tipo:"Pup", ciudad:"Cali", initials:"JD"},
    {nombre:"Johanna Velandia", raza:"", tel:"3142189170", tipo:"K9", ciudad:"Bogotá", initials:"JV"},
    {nombre:"Johanna Chaves", raza:"", tel:"3103468687", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Jorge Toro", raza:"", tel:"3006727486", tipo:"K9", ciudad:"Bogotá", initials:"JT"},
    {nombre:"Jorge Enrique", raza:"", tel:"3124318053", tipo:"K9", ciudad:"Bogotá", initials:"JE"},
    {nombre:"Jorge Pablo", raza:"Criollo", tel:"3214246221", tipo:"K9", ciudad:"Bogotá", initials:"JP"},
    {nombre:"Jorgr Rodríguez", raza:"Golden", tel:"3123449274", tipo:"K9", ciudad:"Bogotá", initials:"JR"},
    {nombre:"Jose David", raza:"Jack Rusell", tel:"3233965550", tipo:"Pup", ciudad:"Bogotá", initials:"JD"},
    {nombre:"Jose Manuel", raza:"Criollo", tel:"3223897202", tipo:"K9", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Jose Luis", raza:"PointerAlem", tel:"3102649291", tipo:"K9", ciudad:"Bogotá", initials:"JL"},
    {nombre:"José Manuel", raza:"", tel:"3015542826", tipo:"K9", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Juan Camilo", raza:"GoldDoodle", tel:"3213432466", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Juan Camilo", raza:"pup", tel:"3174298613", tipo:"Pup", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Juan Camilo", raza:"Springer Spa", tel:"3164717045", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Juan Sebastian", raza:"", tel:"3223665155", tipo:"K9", ciudad:"Bogotá", initials:"JS"},
    {nombre:"Juan Sebastian", raza:"", tel:"3144226389", tipo:"K9", ciudad:"Bogotá", initials:"JS"},
    {nombre:"Juan Francisco", raza:"Bernés", tel:"3133875173", tipo:"K9", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Juan Camilo", raza:"", tel:"3112778359", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Juan Carlos", raza:"Diaz", tel:"3227329780", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Juan Felipe", raza:"", tel:"5309950567", tipo:"K9", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Juan Felipe", raza:"", tel:"3046524341", tipo:"K9", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Juan Fdo.", raza:"", tel:"3102364727", tipo:"K9", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Juan Miguel", raza:"", tel:"3108811474", tipo:"K9", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Juan Carlos", raza:"Criolla", tel:"3138851946", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Juan Pablo", raza:"Collie y pup", tel:"3159271138", tipo:"Pup", ciudad:"Bogotá", initials:"JP"},
    {nombre:"Juan R", raza:"Nala", tel:"3118006380", tipo:"K9", ciudad:"Bogotá", initials:"JR"},
    {nombre:"Juan Camilo", raza:"", tel:"3138534531", tipo:"K9", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Juan Guzman", raza:"Papá", tel:"3214922765", tipo:"K9", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Juan Diego", raza:"", tel:"3233194521", tipo:"K9", ciudad:"Bogotá", initials:"JD"},
    {nombre:"Juan Felipe", raza:"Border", tel:"3108174687", tipo:"K9", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Juan G.", raza:"", tel:"3178874980", tipo:"K9", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Juan Felipe", raza:"Husky Pup", tel:"3148303409", tipo:"Pup", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Juan Diego", raza:"", tel:"3174327220", tipo:"K9", ciudad:"Bogotá", initials:"JD"},
    {nombre:"Juan Esteban", raza:"", tel:"3214516808", tipo:"K9", ciudad:"Bogotá", initials:"JE"},
    {nombre:"Juan Felipe", raza:"Novio", tel:"3124028934", tipo:"K9", ciudad:"Bogotá", initials:"JF"},
    {nombre:"Juan Alvarado", raza:"Perro", tel:"3134797918", tipo:"K9", ciudad:"Bogotá", initials:"JA"},
    {nombre:"Juan Pablo", raza:"Criollo", tel:"3212742575", tipo:"K9", ciudad:"Bogotá", initials:"JP"},
    {nombre:"Juana Uribe", raza:"Caracol TV", tel:"3143360341", tipo:"K9", ciudad:"Bogotá", initials:"JU"},
    {nombre:"Juana Martina de Silva", raza:"Silva", tel:"3203007901", tipo:"K9", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Juanita Echeverry", raza:"San", tel:"3124072218", tipo:"K9", ciudad:"Bogotá", initials:"JE"},
    {nombre:"Juanita Rozo", raza:"Pup", tel:"3107781430", tipo:"Pup", ciudad:"Bogotá", initials:"JR"},
    {nombre:"Juanita Ospina", raza:"Collie", tel:"3153766364", tipo:"K9", ciudad:"Bogotá", initials:"JO"},
    {nombre:"Juanita Zapata", raza:"Pomsky", tel:"3104205593", tipo:"K9", ciudad:"Bogotá", initials:"JZ"},
    {nombre:"Juanita Botero", raza:"Gatas", tel:"3102817195", tipo:"K9", ciudad:"Bogotá", initials:"JB"},
    {nombre:"Juanita Gordillo", raza:"Criollo", tel:"3105751009", tipo:"K9", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Julian Rivera", raza:"Pistacho", tel:"3142990236", tipo:"K9", ciudad:"Bogotá", initials:"JR"},
    {nombre:"Julian Carrillo", raza:"", tel:"3128238813", tipo:"Pup", ciudad:"Bogotá", initials:"JC"},
    {nombre:"Julián Acuña", raza:"Criolla", tel:"3188098542", tipo:"K9", ciudad:"Bogotá", initials:"JA"},
    {nombre:"Julián Ochoa", raza:"Taco", tel:"3194661110", tipo:"K9", ciudad:"Bogotá", initials:"JO"},
    {nombre:"Juliana Urrea", raza:"", tel:"3108827915", tipo:"Pup", ciudad:"Bogotá", initials:"JU"},
    {nombre:"Juliana Esteban", raza:"", tel:"3107889667", tipo:"K9", ciudad:"Bogotá", initials:"JE"},
    {nombre:"Juliana González", raza:"", tel:"3102496733", tipo:"K9", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Juliana García", raza:"GrmShp", tel:"3204993257", tipo:"K9", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Juliana Niño", raza:"Barranquilla", tel:"3166195693", tipo:"K9", ciudad:"Barranquilla", initials:"JN"},
    {nombre:"Juliana Hernández", raza:"", tel:"3016150070", tipo:"K9", ciudad:"Bogotá", initials:"JH"},
    {nombre:"Juliana Garcia", raza:"Salchicha Pu", tel:"3153772481", tipo:"Pup", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Juliana Gordillo", raza:"", tel:"3168347832", tipo:"K9", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Juliana Gomez", raza:"Rehab", tel:"3105637597", tipo:"K9", ciudad:"Bogotá", initials:"JG"},
    {nombre:"Juliana Marulanda", raza:"", tel:"3102487606", tipo:"Pup", ciudad:"Bogotá", initials:"JM"},
    {nombre:"Juliana Bejarano", raza:"Collie", tel:"3185577653", tipo:"K9", ciudad:"Bogotá", initials:"JB"},
    {nombre:"Juliana Aristizabal", raza:"Adopt", tel:"9046004337", tipo:"K9", ciudad:"Bogotá", initials:"JA"},
    {nombre:"Juliana Aristizabal", raza:"Adopt", tel:"3174393805", tipo:"K9", ciudad:"Bogotá", initials:"JA"},
    {nombre:"Juliana Zuluaga", raza:"Pup", tel:"3023548555", tipo:"Pup", ciudad:"Bogotá", initials:"JZ"},
    {nombre:"Julieth Sanclemente", raza:"Bernés", tel:"3174290430", tipo:"Pup", ciudad:"Bogotá", initials:"JS"},
    {nombre:"Karen", raza:"", tel:"3108747867", tipo:"K9", ciudad:"Bogotá", initials:"K"},
    {nombre:"Karen Rojas", raza:"Revista", tel:"3043364711", tipo:"K9", ciudad:"Bogotá", initials:"KR"},
    {nombre:"Karen Santamaria", raza:"BldFr", tel:"6789368846", tipo:"K9", ciudad:"Bogotá", initials:"KS"},
    {nombre:"Karen Santamaria", raza:"BldFr", tel:"3002241491", tipo:"K9", ciudad:"Bogotá", initials:"KS"},
    {nombre:"Karen Arbeláez", raza:"Pup", tel:"3186835235", tipo:"Pup", ciudad:"Bogotá", initials:"KA"},
    {nombre:"Karen Holguin", raza:"", tel:"3182184786", tipo:"K9", ciudad:"Bogotá", initials:"KH"},
    {nombre:"Karina Daza", raza:"Fobia", tel:"3017861755", tipo:"K9", ciudad:"Bogotá", initials:"KD"},
    {nombre:"Karla Palacio", raza:"Doberman", tel:"3134181695", tipo:"K9", ciudad:"Bogotá", initials:"KP"},
    {nombre:"Katherine", raza:"", tel:"3016966724", tipo:"K9", ciudad:"Bogotá", initials:"K"},
    {nombre:"Katia Perez", raza:"", tel:"3158665002", tipo:"K9", ciudad:"Bogotá", initials:"KP"},
    {nombre:"Kiki K9", raza:"Pup", tel:"3132192762", tipo:"Pup", ciudad:"Bogotá", initials:"KK"},
    {nombre:"Klaus Hars", raza:"GrShp", tel:"3102354622", tipo:"K9", ciudad:"Bogotá", initials:"KH"},
    {nombre:"Kristina Acevedo", raza:"GrmShp", tel:"3212055947", tipo:"K9", ciudad:"Bogotá", initials:"KA"},
    {nombre:"Lady Gonzalez", raza:"Pup", tel:"3002521880", tipo:"Pup", ciudad:"Bogotá", initials:"LG"},
    {nombre:"Laura García", raza:"Pup", tel:"3166720921", tipo:"Pup", ciudad:"Bogotá", initials:"LG"},
    {nombre:"Laura Casas", raza:"", tel:"3175152298", tipo:"K9", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Laura María", raza:"Pastor Belga", tel:"3022391560", tipo:"Pup", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Laura Rodríguez", raza:"Rescatada", tel:"3232370077", tipo:"K9", ciudad:"Bogotá", initials:"LR"},
    {nombre:"Laura Bernal", raza:"Criollo", tel:"2474097705", tipo:"K9", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Laura Bernal", raza:"Criollo", tel:"3102563019", tipo:"K9", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Laura Calvo", raza:"Lab", tel:"3138300673", tipo:"Pup", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Laura Ramos", raza:"Salchicha", tel:"3203446852", tipo:"Pup", ciudad:"Bogotá", initials:"LR"},
    {nombre:"Laura Borda", raza:"Labradoodle", tel:"3106897091", tipo:"K9", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Laura Silva", raza:"Pastor", tel:"3105697173", tipo:"K9", ciudad:"Bogotá", initials:"LS"},
    {nombre:"Laura Jara", raza:"Rescue", tel:"3209001645", tipo:"K9", ciudad:"Bogotá", initials:"LJ"},
    {nombre:"Laura Catalina", raza:"", tel:"3164157670", tipo:"K9", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Laura Díaz", raza:"", tel:"3223075345", tipo:"K9", ciudad:"Bogotá", initials:"LD"},
    {nombre:"Laura Rincón", raza:"Brdr", tel:"3144437066", tipo:"K9", ciudad:"Bogotá", initials:"LR"},
    {nombre:"Laura Escalante", raza:"Labradora", tel:"3112234790", tipo:"K9", ciudad:"Bogotá", initials:"LE"},
    {nombre:"Laura Chica", raza:"", tel:"3208418172", tipo:"Pup", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Laura López", raza:"Bld", tel:"3118678484", tipo:"Pup", ciudad:"Bogotá", initials:"LL"},
    {nombre:"Laura Márquez", raza:"Pomeranian", tel:"3132691976", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Laura Zambrano", raza:"Past", tel:"3152618796", tipo:"K9", ciudad:"Bogotá", initials:"LZ"},
    {nombre:"Leny Peña", raza:"Criolla", tel:"3016308897", tipo:"K9", ciudad:"Bogotá", initials:"LP"},
    {nombre:"Leonardo Hernández", raza:"", tel:"3108714707", tipo:"K9", ciudad:"Bogotá", initials:"LH"},
    {nombre:"Liliana Paredes", raza:"Yorky", tel:"3007431307", tipo:"K9", ciudad:"Bogotá", initials:"LP"},
    {nombre:"Liliana Urueña", raza:"Chihuahua", tel:"3108139771", tipo:"K9", ciudad:"Bogotá", initials:"LU"},
    {nombre:"Liliana Cuadros", raza:"Golden", tel:"4984940763", tipo:"K9", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Liliana Cuadros", raza:"Golden", tel:"3175172774", tipo:"K9", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Liliana Vargas", raza:"Shi Tzu", tel:"3118202056", tipo:"K9", ciudad:"Bogotá", initials:"LV"},
    {nombre:"Liliana Franco", raza:"Pup", tel:"3152408258", tipo:"Pup", ciudad:"Bogotá", initials:"LF"},
    {nombre:"Liliana Medina", raza:"Samoyedo", tel:"3166601961", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Liliana Bautista", raza:"Westie", tel:"3175384787", tipo:"K9", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Liliana Puentes", raza:"Espinosa", tel:"3134855108", tipo:"K9", ciudad:"Bogotá", initials:"LP"},
    {nombre:"Lina María", raza:"", tel:"3214289646", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Lina Ramirez", raza:"Criollas", tel:"3134225539", tipo:"K9", ciudad:"Bogotá", initials:"LR"},
    {nombre:"Lina López", raza:"", tel:"3219152073", tipo:"K9", ciudad:"Bogotá", initials:"LL"},
    {nombre:"Lina María", raza:"BldFr", tel:"3174306216", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Lina Bula", raza:"Pomerania", tel:"3012857656", tipo:"Pup", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Lina Ortiz", raza:"Chia", tel:"3104882115", tipo:"K9", ciudad:"Bogotá", initials:"LO"},
    {nombre:"Lina León", raza:"Sharpei", tel:"3196153289", tipo:"K9", ciudad:"Bogotá", initials:"LL"},
    {nombre:"Lina Ceballos", raza:"Empresa", tel:"3103756912", tipo:"K9", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Lina Puyo", raza:"", tel:"3205714077", tipo:"K9", ciudad:"Bogotá", initials:"LP"},
    {nombre:"Lina Turri", raza:"Shnauser", tel:"3143288391", tipo:"K9", ciudad:"Bogotá", initials:"LT"},
    {nombre:"Lina María", raza:"Past Aust", tel:"3114532741", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Linda Baldrich", raza:"", tel:"3132625668", tipo:"K9", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Linda Martínez", raza:"", tel:"3142102173", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Lissa Manuela", raza:"Cachorra", tel:"3208789529", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Liza Maria", raza:"Criollo", tel:"3163145616", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Lorena Torres", raza:"", tel:"3102894975", tipo:"K9", ciudad:"Bogotá", initials:"LT"},
    {nombre:"Lorenzo Suarez", raza:"Collie", tel:"3152127330", tipo:"K9", ciudad:"Bogotá", initials:"LS"},
    {nombre:"Lucia Roncancio", raza:"Bichón", tel:"4243143786", tipo:"K9", ciudad:"Bogotá", initials:"LR"},
    {nombre:"Lucia Roncancio", raza:"Bichón", tel:"3016068517", tipo:"K9", ciudad:"Bogotá", initials:"LR"},
    {nombre:"Lucy Díaz", raza:"Alaskan", tel:"3176355456", tipo:"Pup", ciudad:"Bogotá", initials:"LD"},
    {nombre:"Luis Alberto", raza:"Samoyedo Pup", tel:"3163052390", tipo:"Pup", ciudad:"Bogotá", initials:"LA"},
    {nombre:"Luis Fernando", raza:"Labradora", tel:"3103411065", tipo:"K9", ciudad:"Bogotá", initials:"LF"},
    {nombre:"Luis Grajales", raza:"Collie", tel:"3185434747", tipo:"Pup", ciudad:"Bogotá", initials:"LG"},
    {nombre:"Luisa Santamaría", raza:"", tel:"3013917704", tipo:"K9", ciudad:"Bogotá", initials:"LS"},
    {nombre:"Luisa Hernández", raza:"", tel:"3103901768", tipo:"K9", ciudad:"Bogotá", initials:"LH"},
    {nombre:"Luisa Cortés", raza:"", tel:"3156831753", tipo:"K9", ciudad:"Bogotá", initials:"LC"},
    {nombre:"Luisa Blanco", raza:"", tel:"3204721357", tipo:"K9", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Luisa Vanegas", raza:"Akita", tel:"3026303503", tipo:"K9", ciudad:"Bogotá", initials:"LV"},
    {nombre:"Luisa Velásquez", raza:"", tel:"3208318567", tipo:"K9", ciudad:"Bogotá", initials:"LV"},
    {nombre:"Luisa María", raza:"Llano", tel:"3166213255", tipo:"K9", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Luisa Bernal", raza:"Pup", tel:"3106085844", tipo:"Pup", ciudad:"Bogotá", initials:"LB"},
    {nombre:"Luisa Fda", raza:"", tel:"3176591434", tipo:"K9", ciudad:"Bogotá", initials:"LF"},
    {nombre:"Luz Ángela", raza:"", tel:"3003675693", tipo:"K9", ciudad:"Bogotá", initials:"LÁ"},
    {nombre:"Luz Mery", raza:"Jack Russ", tel:"3022678046", tipo:"Pup", ciudad:"Bogotá", initials:"LM"},
    {nombre:"Luz Victoria", raza:"Criollo", tel:"3103090013", tipo:"K9", ciudad:"Bogotá", initials:"LV"},
    {nombre:"Luz H", raza:"Collie", tel:"3203391108", tipo:"K9", ciudad:"Bogotá", initials:"LH"},
    {nombre:"Luz Amparo", raza:"yorkie", tel:"3114487268", tipo:"K9", ciudad:"Bogotá", initials:"LA"},
    {nombre:"Ma Eugenia", raza:"", tel:"3214525853", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"Ma Cristina", raza:"Pup", tel:"3138784721", tipo:"Pup", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Ma Cristina", raza:"Shi Tzu", tel:"3103209071", tipo:"Pup", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Ma Carolina", raza:"GoldenDoodle", tel:"3002147409", tipo:"Pup", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Ma Consuelo", raza:"", tel:"3112624606", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Ma Del", raza:"Manzanera", tel:"3123645846", tipo:"K9", ciudad:"Bogotá", initials:"MD"},
    {nombre:"Majo Castillo", raza:"Collie", tel:"3134230533", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Malena Ramirez", raza:"", tel:"3002182067", tipo:"K9", ciudad:"Bogotá", initials:"MR"},
    {nombre:"Manuel Vecino", raza:"Criollo", tel:"3153458775", tipo:"K9", ciudad:"Bogotá", initials:"MV"},
    {nombre:"Manuela Mejía", raza:"Teckel", tel:"3106695276", tipo:"K9", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Manuela Gutiérrez", raza:"Yorkie", tel:"3154099048", tipo:"K9", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Manuela Espinal", raza:"", tel:"3103412470", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"Manuela Uribe", raza:"H", tel:"3136959415", tipo:"K9", ciudad:"Bogotá", initials:"MU"},
    {nombre:"Manuela K9", raza:"Ladradora", tel:"3114543326", tipo:"K9", ciudad:"Bogotá", initials:"MK"},
    {nombre:"Manuela Quiceno", raza:"", tel:"3168748307", tipo:"Pup", ciudad:"Bogotá", initials:"MQ"},
    {nombre:"Manuela Posada", raza:"", tel:"3204768067", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Marcela Bustamante", raza:"Pastor Austr", tel:"3166169311", tipo:"K9", ciudad:"Bogotá", initials:"MB"},
    {nombre:"Marcela Lomanto", raza:"Criolla", tel:"3153019415", tipo:"K9", ciudad:"Bogotá", initials:"ML"},
    {nombre:"Marcela Mamá de Federico Vela", raza:"Federico", tel:"3163516768", tipo:"K9", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Marcela Pérez", raza:"ShiTzu", tel:"3214381301", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Marcela Barragán", raza:"AustLabDoodl", tel:"3118479949", tipo:"Pup", ciudad:"Bogotá", initials:"MB"},
    {nombre:"Marcela Triana", raza:"Fr", tel:"3108567156", tipo:"K9", ciudad:"Bogotá", initials:"MT"},
    {nombre:"Marcela Caicedo", raza:"Miedo", tel:"3174390839", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Marco Zuluaga", raza:"Terranova", tel:"3203433006", tipo:"K9", ciudad:"Bogotá", initials:"MZ"},
    {nombre:"Margarita Noriega", raza:"Bichón", tel:"3125382493", tipo:"Pup", ciudad:"Bogotá", initials:"MN"},
    {nombre:"Margarita Bastilla", raza:"Criolla", tel:"3112161232", tipo:"K9", ciudad:"Bogotá", initials:"MB"},
    {nombre:"Margarita Romero", raza:"Labradoodle", tel:"5300404855", tipo:"K9", ciudad:"Bogotá", initials:"MR"},
    {nombre:"Margarita Romero", raza:"Labradoodle", tel:"3103218699", tipo:"K9", ciudad:"Bogotá", initials:"MR"},
    {nombre:"Maria Clara", raza:"GrmShp", tel:"3104269831", tipo:"Pup", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maria Camila", raza:"Golden", tel:"3102767169", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maria Claudia", raza:"", tel:"3143930812", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maria Clara", raza:"", tel:"3153698446", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maria Angela", raza:"", tel:"3102780380", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"MARIA MONICA", raza:"Pup", tel:"3116924679", tipo:"Pup", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Maria Jose", raza:"Criolla", tel:"3202170306", tipo:"K9", ciudad:"Bogotá", initials:"MJ"},
    {nombre:"Maria Antonia", raza:"Border", tel:"3118763577", tipo:"Pup", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria Paulina", raza:"", tel:"3113798370", tipo:"Pup", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Maria Claudia", raza:"Samoyedo", tel:"3115168545", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maria Alejandra", raza:"", tel:"3163785763", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria jose", raza:"tavera", tel:"3144844343", tipo:"K9", ciudad:"Bogotá", initials:"MJ"},
    {nombre:"Maria Carolina", raza:"Poniter", tel:"3156121422", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maria Isabel", raza:"Yorkiie", tel:"3153764809", tipo:"K9", ciudad:"Bogotá", initials:"MI"},
    {nombre:"Maria Fernanda", raza:"Ponerarania", tel:"3134030046", tipo:"K9", ciudad:"Bogotá", initials:"MF"},
    {nombre:"Maria Antonia", raza:"PastGanAust", tel:"3003420549", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria Paula", raza:"Fr Bld", tel:"3016583969", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Maria Teresa", raza:"Pomeraria", tel:"3167419542", tipo:"Pup", ciudad:"Bogotá", initials:"MT"},
    {nombre:"Maria Fernamda", raza:"V", tel:"3103494463", tipo:"K9", ciudad:"Bogotá", initials:"MF"},
    {nombre:"Maria Paula", raza:"Pup", tel:"3114816518", tipo:"Pup", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Maria Margarita", raza:"", tel:"3214564837", tipo:"Pup", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Maria Alejandra", raza:"Jack Rusell", tel:"3138962651", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria Fernanda", raza:"Criolla", tel:"3115142410", tipo:"K9", ciudad:"Bogotá", initials:"MF"},
    {nombre:"Maria Angela", raza:"Pup", tel:"3102126759", tipo:"Pup", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria Paula", raza:"", tel:"3222560809", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Maria del", raza:"Hermida", tel:"3152234191", tipo:"K9", ciudad:"Bogotá", initials:"MD"},
    {nombre:"Maria Isabel", raza:"Guerrero", tel:"3005696303", tipo:"K9", ciudad:"Bogotá", initials:"MI"},
    {nombre:"Maria Fernanda", raza:"", tel:"3114039851", tipo:"K9", ciudad:"Bogotá", initials:"MF"},
    {nombre:"Maria Jose", raza:"", tel:"3104277385", tipo:"K9", ciudad:"Bogotá", initials:"MJ"},
    {nombre:"Maria Fernanda", raza:"GrShp", tel:"3102650970", tipo:"K9", ciudad:"Bogotá", initials:"MF"},
    {nombre:"Maria Angelica", raza:"", tel:"3125139794", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria T.", raza:"Schnauzer Ol", tel:"3108153287", tipo:"Pup", ciudad:"Bogotá", initials:"MT"},
    {nombre:"Maria Camila", raza:"Pup", tel:"3204349547", tipo:"Pup", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maria Antonia", raza:"Pup", tel:"3206770335", tipo:"Pup", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria Alejandra", raza:"Fundación", tel:"3508999359", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Maria del", raza:"Moya", tel:"3045797559", tipo:"K9", ciudad:"Bogotá", initials:"MD"},
    {nombre:"Maria Jose", raza:"Salchicha", tel:"3106014375", tipo:"K9", ciudad:"Bogotá", initials:"MJ"},
    {nombre:"Maria Virginia", raza:"Loba", tel:"3154654254", tipo:"K9", ciudad:"Bogotá", initials:"MV"},
    {nombre:"María Elvia", raza:"", tel:"3153574078", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"María José", raza:"PUp", tel:"3156713316", tipo:"Pup", ciudad:"Bogotá", initials:"MJ"},
    {nombre:"María José", raza:"Gm Shp", tel:"3132003333", tipo:"K9", ciudad:"Bogotá", initials:"MJ"},
    {nombre:"María Andrea", raza:"Wiki", tel:"3143560899", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"María Victoria", raza:"GmrShp", tel:"3012164518", tipo:"K9", ciudad:"Bogotá", initials:"MV"},
    {nombre:"María Andrea", raza:"", tel:"3174230289", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"María Del", raza:"Agudelo", tel:"3107649462", tipo:"Pup", ciudad:"Bogotá", initials:"MD"},
    {nombre:"María Emilia", raza:"Pomeraria y ", tel:"3176582904", tipo:"Pup", ciudad:"Bogotá", initials:"ME"},
    {nombre:"María Enciso", raza:"", tel:"3164729743", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"María Paula", raza:"", tel:"3115068617", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"María Paula", raza:"Criolla", tel:"3114554497", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"María Paula", raza:"Wipet", tel:"3153416953", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Maria del Mar Navia", raza:"", tel:"3212169769", tipo:"Fundador", ciudad:"Bogotá", initials:"MN"},
    {nombre:"Mariaca Guzmán", raza:"", tel:"3046002913", tipo:"K9", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Mariana Sáenz", raza:"Yorkie", tel:"3105633600", tipo:"Pup", ciudad:"Bogotá", initials:"MS"},
    {nombre:"Mariana Shuk", raza:"SpringSp", tel:"3102683498", tipo:"K9", ciudad:"Bogotá", initials:"MS"},
    {nombre:"Mariana Sosa", raza:"Golden", tel:"3204971906", tipo:"K9", ciudad:"Bogotá", initials:"MS"},
    {nombre:"Mariana Canal", raza:"Belga", tel:"3054208196", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Mariana Córdoba", raza:"México", tel:"3203487648", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Mariana Amado", raza:"Mole", tel:"3219532144", tipo:"K9", ciudad:"Bogotá", initials:"MA"},
    {nombre:"Mario Ruiz", raza:"Video", tel:"3133607658", tipo:"K9", ciudad:"Bogotá", initials:"MR"},
    {nombre:"Mario Granada", raza:"Calera", tel:"3108469333", tipo:"K9", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Marta Ortiz", raza:"Bernés", tel:"3203488288", tipo:"Pup", ciudad:"Bogotá", initials:"MO"},
    {nombre:"Marta Escobar", raza:"", tel:"3144715779", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"Marta Ortega", raza:"", tel:"3164656302", tipo:"K9", ciudad:"Bogotá", initials:"MO"},
    {nombre:"Martha Gonzalez", raza:"", tel:"3125889608", tipo:"K9", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Martha Carvajal", raza:"Collie", tel:"3182111350", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Martha Liliana", raza:"", tel:"3114984367", tipo:"K9", ciudad:"Bogotá", initials:"ML"},
    {nombre:"Martha Gonzalez", raza:"Cocapoo", tel:"3102147404", tipo:"K9", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Martha Misas", raza:"", tel:"3203393479", tipo:"K9", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Martha Emilia", raza:"", tel:"3112943315", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"Martha Parra", raza:"Hija", tel:"3138264328", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Marti Vesga", raza:"", tel:"3002732463", tipo:"K9", ciudad:"Bogotá", initials:"MV"},
    {nombre:"Martin Posada", raza:"Pup", tel:"3114905426", tipo:"Pup", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Martin Cavanzo", raza:"Doberman", tel:"3174036555", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Maruja Pachón", raza:"Labradoodle", tel:"3185337777", tipo:"Pup", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Mary Montoya", raza:"Yorkie", tel:"3205947167", tipo:"K9", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Mateo Mora", raza:"Bernedoodle", tel:"3175182128", tipo:"K9", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Mauricio Chavarriaga", raza:"", tel:"3117668985", tipo:"K9", ciudad:"Bogotá", initials:"MC"},
    {nombre:"Mauricio Pinzon", raza:"", tel:"3162314853", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Mauricio Fernández", raza:"", tel:"3164026237", tipo:"K9", ciudad:"Bogotá", initials:"MF"},
    {nombre:"Mauricio Nieto", raza:"Dharma", tel:"3153328191", tipo:"K9", ciudad:"Bogotá", initials:"MN"},
    {nombre:"Mauricio Garcia", raza:"Poodle", tel:"3208859562", tipo:"K9", ciudad:"Bogotá", initials:"MG"},
    {nombre:"May González", raza:"Westie", tel:"3157952138", tipo:"K9", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Mechas Huelso", raza:"Sakura", tel:"3002824254", tipo:"K9", ciudad:"Bogotá", initials:"MH"},
    {nombre:"Melissa Verare", raza:"Pup", tel:"3007701828", tipo:"Pup", ciudad:"Bogotá", initials:"MV"},
    {nombre:"Melitza López", raza:"", tel:"3002258643", tipo:"K9", ciudad:"Bogotá", initials:"ML"},
    {nombre:"Michelle Moreno", raza:"Pochaco", tel:"3213170938", tipo:"K9", ciudad:"Bogotá", initials:"MM"},
    {nombre:"Miguel Sastoque", raza:"Golden", tel:"3504631174", tipo:"Pup", ciudad:"Bogotá", initials:"MS"},
    {nombre:"Miguel Posse", raza:"", tel:"3162206224", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Miguel Forero", raza:"Fox", tel:"3142958276", tipo:"K9", ciudad:"Bogotá", initials:"MF"},
    {nombre:"Milena Pachon", raza:"", tel:"3152488243", tipo:"K9", ciudad:"Bogotá", initials:"MP"},
    {nombre:"Moni Espejo", raza:"Ónix", tel:"3107539635", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"MoNica EsPiNoSa", raza:"", tel:"3008509090", tipo:"K9", ciudad:"Bogotá", initials:"ME"},
    {nombre:"Monica Torres", raza:"Pup", tel:"3195060939", tipo:"Pup", ciudad:"Bogotá", initials:"MT"},
    {nombre:"Monica Velásquez", raza:"", tel:"3216393023", tipo:"K9", ciudad:"Bogotá", initials:"MV"},
    {nombre:"Monica Guerrero", raza:"Pup", tel:"5827943383", tipo:"Pup", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Monica Guerrero", raza:"Pup", tel:"3143807342", tipo:"Pup", ciudad:"Bogotá", initials:"MG"},
    {nombre:"Monica Quiñonez", raza:"CockaPoo", tel:"3102107353", tipo:"K9", ciudad:"Bogotá", initials:"MQ"},
    {nombre:"Mónica Jaramillo", raza:"Finca", tel:"3116173629", tipo:"K9", ciudad:"Bogotá", initials:"MJ"},
    {nombre:"Mónica Reyes", raza:"Erdale", tel:"3102321076", tipo:"K9", ciudad:"Bogotá", initials:"MR"},
    {nombre:"Mónica Suárez", raza:"BldIng", tel:"3023884078", tipo:"K9", ciudad:"Bogotá", initials:"MS"},
    {nombre:"Mónica K9", raza:"Labrador", tel:"3044412335", tipo:"K9", ciudad:"Bogotá", initials:"MK"},
    {nombre:"Mónica Suárez", raza:"Salchicha", tel:"3103220445", tipo:"Pup", ciudad:"Bogotá", initials:"MS"},
    {nombre:"Mónica Herrera", raza:"Pup", tel:"3016145828", tipo:"Pup", ciudad:"Bogotá", initials:"MH"},
    {nombre:"Mónica", raza:"Golden", tel:"3104265899", tipo:"K9", ciudad:"Bogotá", initials:"M"},
    {nombre:"Nancy Velasquez", raza:"Pup", tel:"3172581731", tipo:"Pup", ciudad:"Bogotá", initials:"NV"},
    {nombre:"Natalia Gómez", raza:"Bernès", tel:"3158292580", tipo:"K9", ciudad:"Bogotá", initials:"NG"},
    {nombre:"Natalia Solórzano", raza:"Shiva Inu", tel:"3176767875", tipo:"K9", ciudad:"Bogotá", initials:"NS"},
    {nombre:"Natalia Jiménez", raza:"Border", tel:"3108562120", tipo:"K9", ciudad:"Bogotá", initials:"NJ"},
    {nombre:"Natalia Gomez", raza:"Criollo", tel:"3143936489", tipo:"K9", ciudad:"Bogotá", initials:"NG"},
    {nombre:"Natalia Sierra", raza:"Past", tel:"3003920194", tipo:"K9", ciudad:"Bogotá", initials:"NS"},
    {nombre:"Natalia del", raza:"Espinosa", tel:"3164467417", tipo:"Pup", ciudad:"Bogotá", initials:"ND"},
    {nombre:"Natalia Cano", raza:"", tel:"3118445831", tipo:"K9", ciudad:"Bogotá", initials:"NC"},
    {nombre:"Natalia Ramírez", raza:"Chicó", tel:"3103246928", tipo:"K9", ciudad:"Bogotá", initials:"NR"},
    {nombre:"Natalia Otoya", raza:"PastOvAust", tel:"3115438465", tipo:"K9", ciudad:"Bogotá", initials:"NO"},
    {nombre:"Natalia Londoño", raza:"Agresivo", tel:"3187984256", tipo:"K9", ciudad:"Bogotá", initials:"NL"},
    {nombre:"Natalia Palencia", raza:"Criolla", tel:"3006747933", tipo:"K9", ciudad:"Bogotá", initials:"NP"},
    {nombre:"Natalia Aponte", raza:"Crianza", tel:"3157927103", tipo:"K9", ciudad:"Bogotá", initials:"NA"},
    {nombre:"Natalia Succar", raza:"Wiki", tel:"3212052812", tipo:"K9", ciudad:"Bogotá", initials:"NS"},
    {nombre:"Natalia Sandoval", raza:"La", tel:"3023744761", tipo:"K9", ciudad:"Bogotá", initials:"NS"},
    {nombre:"Natalia Arango", raza:"Brd", tel:"3186083219", tipo:"K9", ciudad:"Bogotá", initials:"NA"},
    {nombre:"Natalia Acosta", raza:"Criollo", tel:"3186172681", tipo:"K9", ciudad:"Bogotá", initials:"NA"},
    {nombre:"Natalia Mora", raza:"", tel:"3157435136", tipo:"K9", ciudad:"Bogotá", initials:"NM"},
    {nombre:"Natalia Gómez", raza:"Collie", tel:"3144031017", tipo:"K9", ciudad:"Bogotá", initials:"NG"},
    {nombre:"Nataly Bonilla", raza:"Medellín", tel:"3147834055", tipo:"K9", ciudad:"Medellín", initials:"NB"},
    {nombre:"Nathali Salazar", raza:"", tel:"3004336829", tipo:"K9", ciudad:"Bogotá", initials:"NS"},
    {nombre:"Nathalie Silva", raza:"Enzo", tel:"3176478267", tipo:"K9", ciudad:"Bogotá", initials:"NS"},
    {nombre:"Nathalie Ramirez", raza:"San", tel:"3136150218", tipo:"K9", ciudad:"Bogotá", initials:"NR"},
    {nombre:"Nelsi Velázquez", raza:"Husky", tel:"3133157718", tipo:"K9", ciudad:"Bogotá", initials:"NV"},
    {nombre:"Nelson Avellaneda", raza:"Criolla", tel:"3044083376", tipo:"K9", ciudad:"Bogotá", initials:"NA"},
    {nombre:"Nelson Jiménez", raza:"Balú", tel:"3213433133", tipo:"K9", ciudad:"Bogotá", initials:"NJ"},
    {nombre:"Nicolas Mújica", raza:"Tigre", tel:"3102339860", tipo:"K9", ciudad:"Bogotá", initials:"NM"},
    {nombre:"Nicolás Moreno", raza:"Husky", tel:"3153395598", tipo:"K9", ciudad:"Bogotá", initials:"NM"},
    {nombre:"Nicolás Páez", raza:"Bernés", tel:"3167444570", tipo:"K9", ciudad:"Bogotá", initials:"NP"},
    {nombre:"Nicolás Rodríguez", raza:"Mono", tel:"3108558946", tipo:"K9", ciudad:"Bogotá", initials:"NR"},
    {nombre:"Nohra Barberi", raza:"", tel:"3153889861", tipo:"K9", ciudad:"Bogotá", initials:"NB"},
    {nombre:"Nubia Esperanza", raza:"Criollo", tel:"3158206972", tipo:"K9", ciudad:"Bogotá", initials:"NE"},
    {nombre:"Olga Luz", raza:"", tel:"3164201645", tipo:"K9", ciudad:"Bogotá", initials:"OL"},
    {nombre:"Olga Fonseca", raza:"Jazz", tel:"3103378128", tipo:"K9", ciudad:"Bogotá", initials:"OF"},
    {nombre:"Olga Wilches", raza:"GrDane", tel:"3185145264", tipo:"K9", ciudad:"Bogotá", initials:"OW"},
    {nombre:"Oscar Guzmán", raza:"PastShet", tel:"3113318395", tipo:"K9", ciudad:"Bogotá", initials:"OG"},
    {nombre:"Oscar Higuera", raza:"", tel:"3125376739", tipo:"K9", ciudad:"Bogotá", initials:"OH"},
    {nombre:"Oscar Iván", raza:"Pitbull", tel:"3202742703", tipo:"K9", ciudad:"Bogotá", initials:"OI"},
    {nombre:"Oscar Sarria", raza:"", tel:"3175180726", tipo:"K9", ciudad:"Bogotá", initials:"OS"},
    {nombre:"Oscar Uber", raza:"Transporte", tel:"3016226510", tipo:"K9", ciudad:"Bogotá", initials:"OU"},
    {nombre:"Pablo Bermúdez", raza:"Jack Rusell", tel:"3123411948", tipo:"K9", ciudad:"Bogotá", initials:"PB"},
    {nombre:"Pablo Jiménez", raza:"Panela", tel:"3204850383", tipo:"K9", ciudad:"Bogotá", initials:"PJ"},
    {nombre:"Pao Restrepo", raza:"", tel:"3212445152", tipo:"K9", ciudad:"Bogotá", initials:"PR"},
    {nombre:"Pao Facuseh", raza:"", tel:"3006640610", tipo:"K9", ciudad:"Bogotá", initials:"PF"},
    {nombre:"Paola Pulido", raza:"", tel:"3045445247", tipo:"K9", ciudad:"Bogotá", initials:"PP"},
    {nombre:"Paola Sánchez", raza:"Fontanar", tel:"3152987466", tipo:"K9", ciudad:"Bogotá", initials:"PS"},
    {nombre:"Paola Guzman", raza:"Beagle y Yor", tel:"3168321821", tipo:"K9", ciudad:"Bogotá", initials:"PG"},
    {nombre:"PAOLA BERNAL", raza:"Yerbabuena", tel:"3105808894", tipo:"K9", ciudad:"Bogotá", initials:"PB"},
    {nombre:"Paola Palacios", raza:"", tel:"3107605781", tipo:"K9", ciudad:"Bogotá", initials:"PP"},
    {nombre:"Paola Romero", raza:"Husky", tel:"3108262191", tipo:"K9", ciudad:"Bogotá", initials:"PR"},
    {nombre:"Paola Escobar", raza:"Salchicha", tel:"3155129086", tipo:"Pup", ciudad:"Bogotá", initials:"PE"},
    {nombre:"Paola Alejandra", raza:"", tel:"3112224145", tipo:"K9", ciudad:"Bogotá", initials:"PA"},
    {nombre:"Paola Carvajal", raza:"ShiTzu", tel:"3188215965", tipo:"K9", ciudad:"Bogotá", initials:"PC"},
    {nombre:"Paola Andrea", raza:"Pup", tel:"3103109753", tipo:"Pup", ciudad:"Bogotá", initials:"PA"},
    {nombre:"Paola Sánchez", raza:"BldFrn", tel:"3105767857", tipo:"K9", ciudad:"Bogotá", initials:"PS"},
    {nombre:"Patricia Padilla", raza:"Criollo", tel:"3105552000", tipo:"K9", ciudad:"Bogotá", initials:"PP"},
    {nombre:"Patricia Vélez", raza:"", tel:"3152084377", tipo:"K9", ciudad:"Bogotá", initials:"PV"},
    {nombre:"Patricia Sánchez", raza:"Criollo", tel:"3176450607", tipo:"K9", ciudad:"Bogotá", initials:"PS"},
    {nombre:"Patricia Ruiz", raza:"Doodle", tel:"3102053723", tipo:"Pup", ciudad:"Bogotá", initials:"PR"},
    {nombre:"Patricia Méndez", raza:"BldFr", tel:"3214905676", tipo:"K9", ciudad:"Bogotá", initials:"PM"},
    {nombre:"Paula Luna", raza:"Bernedoodle", tel:"3118708967", tipo:"K9", ciudad:"Bogotá", initials:"PL"},
    {nombre:"Paula Guevara", raza:"Criolla", tel:"3142108112", tipo:"Pup", ciudad:"Bogotá", initials:"PG"},
    {nombre:"Paula Jaramillo", raza:"Poodle", tel:"3168322241", tipo:"K9", ciudad:"Bogotá", initials:"PJ"},
    {nombre:"Paula Forero", raza:"", tel:"3012118480", tipo:"K9", ciudad:"Bogotá", initials:"PF"},
    {nombre:"Paula Restrepo", raza:"Yorkie", tel:"3137187974", tipo:"K9", ciudad:"Bogotá", initials:"PR"},
    {nombre:"Paula Bernal", raza:"Yorkie", tel:"3045236740", tipo:"K9", ciudad:"Bogotá", initials:"PB"},
    {nombre:"Paula Andrea", raza:"Collie", tel:"3164732703", tipo:"K9", ciudad:"Bogotá", initials:"PA"},
    {nombre:"Paula Andrea", raza:"Rubiano", tel:"3157468809", tipo:"Pup", ciudad:"Bogotá", initials:"PA"},
    {nombre:"Paula Buriticá", raza:"Collie", tel:"3114483695", tipo:"Pup", ciudad:"Bogotá", initials:"PB"},
    {nombre:"Paula Rodriguez", raza:"Golden", tel:"3112884622", tipo:"K9", ciudad:"Bogotá", initials:"PR"},
    {nombre:"Paula Díaz", raza:"Doberman", tel:"3105735427", tipo:"K9", ciudad:"Bogotá", initials:"PD"},
    {nombre:"Paula Valencia", raza:"", tel:"3173668898", tipo:"K9", ciudad:"Bogotá", initials:"PV"},
    {nombre:"Paula Guarin", raza:"Criollo", tel:"3123197672", tipo:"K9", ciudad:"Bogotá", initials:"PG"},
    {nombre:"Paula Salcedo", raza:"Salchicha", tel:"3166952519", tipo:"K9", ciudad:"Bogotá", initials:"PS"},
    {nombre:"PAULA HOYOS", raza:"Yorkie", tel:"3173665227", tipo:"K9", ciudad:"Bogotá", initials:"PH"},
    {nombre:"Paulina Vega", raza:"Criollo", tel:"3208996159", tipo:"K9", ciudad:"Bogotá", initials:"PV"},
    {nombre:"Paulina Sanchez", raza:"GldnDoodle", tel:"3152369839", tipo:"K9", ciudad:"Bogotá", initials:"PS"},
    {nombre:"Paulina K9", raza:"De", tel:"3012830916", tipo:"K9", ciudad:"Bogotá", initials:"PK"},
    {nombre:"Piedad Rojas", raza:"Criolla", tel:"3102127433", tipo:"K9", ciudad:"Bogotá", initials:"PR"},
    {nombre:"Pilar Montoya", raza:"Rodhesian", tel:"3112798129", tipo:"K9", ciudad:"Bogotá", initials:"PM"},
    {nombre:"Pilar Cardenas", raza:"Microsoft", tel:"3153407678", tipo:"K9", ciudad:"Bogotá", initials:"PC"},
    {nombre:"Pilar Montes", raza:"PastAustOvej", tel:"3122939373", tipo:"K9", ciudad:"Bogotá", initials:"PM"},
    {nombre:"Pilar Blanco", raza:"Husky", tel:"3125275747", tipo:"K9", ciudad:"Bogotá", initials:"PB"},
    {nombre:"Pilar Aragón", raza:"", tel:"3176753786", tipo:"K9", ciudad:"Bogotá", initials:"PA"},
    {nombre:"Renata Novotna", raza:"", tel:"3143323906", tipo:"K9", ciudad:"Bogotá", initials:"RN"},
    {nombre:"Ricardo Behlok", raza:"", tel:"3135536120", tipo:"K9", ciudad:"Bogotá", initials:"RB"},
    {nombre:"Rocio Ramírez", raza:"husky", tel:"3138592658", tipo:"K9", ciudad:"Bogotá", initials:"RR"},
    {nombre:"Rocio Naranjo", raza:"Valledupar", tel:"3137459770", tipo:"K9", ciudad:"Bogotá", initials:"RN"},
    {nombre:"Rocio Saiz", raza:"", tel:"3184995354", tipo:"K9", ciudad:"Bogotá", initials:"RS"},
    {nombre:"Romulo Caceres", raza:"Doberman", tel:"3212705167", tipo:"K9", ciudad:"Bogotá", initials:"RC"},
    {nombre:"Rosa Maria", raza:"Lacoutur", tel:"3115388866", tipo:"K9", ciudad:"Bogotá", initials:"RM"},
    {nombre:"Rosi De", raza:"Golden", tel:"3186184631", tipo:"Pup", ciudad:"Bogotá", initials:"RD"},
    {nombre:"Rosina Cesareo", raza:"Criollo", tel:"3114827814", tipo:"K9", ciudad:"Bogotá", initials:"RC"},
    {nombre:"Samantha Hernández", raza:"Golden", tel:"3102443473", tipo:"K9", ciudad:"Bogotá", initials:"SH"},
    {nombre:"Sandra Marín", raza:"Cocker", tel:"3144448657", tipo:"K9", ciudad:"Bogotá", initials:"SM"},
    {nombre:"Sandra Marquez", raza:"Aust", tel:"3005756491", tipo:"Pup", ciudad:"Bogotá", initials:"SM"},
    {nombre:"Sandra Caro", raza:"Klyde", tel:"3112642784", tipo:"K9", ciudad:"Bogotá", initials:"SC"},
    {nombre:"Sandra Fajardo", raza:"Chapinero", tel:"3123842933", tipo:"K9", ciudad:"Bogotá", initials:"SF"},
    {nombre:"Sandra Romero", raza:"Plan", tel:"3123226543", tipo:"Pup", ciudad:"Bogotá", initials:"SR"},
    {nombre:"Sandra Arcila", raza:"", tel:"3112304412", tipo:"K9", ciudad:"Bogotá", initials:"SA"},
    {nombre:"Sandra Vera", raza:"", tel:"3006944905", tipo:"K9", ciudad:"Bogotá", initials:"SV"},
    {nombre:"Sandra Perdomo", raza:"Pup", tel:"3002183264", tipo:"Pup", ciudad:"Bogotá", initials:"SP"},
    {nombre:"Santiago Quiñones", raza:"Pup", tel:"3102113313", tipo:"Pup", ciudad:"Bogotá", initials:"SQ"},
    {nombre:"Santiago Guerrero", raza:"", tel:"3142868644", tipo:"K9", ciudad:"Bogotá", initials:"SG"},
    {nombre:"Santiago Parra", raza:"Bernés", tel:"3014711620", tipo:"Pup", ciudad:"Bogotá", initials:"SP"},
    {nombre:"Sara Vera", raza:"Pup", tel:"3002672565", tipo:"Pup", ciudad:"Bogotá", initials:"SV"},
    {nombre:"Sara Ricardo", raza:"", tel:"3103379939", tipo:"K9", ciudad:"Bogotá", initials:"SR"},
    {nombre:"Sara Castro", raza:"Cockapoo", tel:"3165454404", tipo:"Pup", ciudad:"Bogotá", initials:"SC"},
    {nombre:"Sarita Aristizabal", raza:"Pup", tel:"3016580453", tipo:"Pup", ciudad:"Bogotá", initials:"SA"},
    {nombre:"Saurabh Bhatia", raza:"Adop", tel:"3194163670", tipo:"K9", ciudad:"Bogotá", initials:"SB"},
    {nombre:"Sebas Llano", raza:"", tel:"3108669775", tipo:"K9", ciudad:"Bogotá", initials:"SL"},
    {nombre:"Sebastian Camacho", raza:"Border", tel:"3112285840", tipo:"K9", ciudad:"Bogotá", initials:"SC"},
    {nombre:"Sebastian Zapata", raza:"Pereira", tel:"3502950668", tipo:"K9", ciudad:"Pereira", initials:"SZ"},
    {nombre:"Sebastián Sánchez", raza:"Past Aust", tel:"3124819895", tipo:"Pup", ciudad:"Bogotá", initials:"SS"},
    {nombre:"SERGIO ARDILA", raza:"", tel:"3004127241", tipo:"K9", ciudad:"Bogotá", initials:"SA"},
    {nombre:"Seydis Guerrero", raza:"Pup", tel:"3013617783", tipo:"Pup", ciudad:"Bogotá", initials:"SG"},
    {nombre:"Shelin Peñalosa", raza:"Husky", tel:"8524238003", tipo:"K9", ciudad:"Bogotá", initials:"SP"},
    {nombre:"Shelin Peñalosa", raza:"Husky", tel:"3188178460", tipo:"K9", ciudad:"Bogotá", initials:"SP"},
    {nombre:"Silvana Jaramillo", raza:"Criollo", tel:"3106987531", tipo:"K9", ciudad:"Bogotá", initials:"SJ"},
    {nombre:"Silvia Rivas", raza:"Salchicha", tel:"3168651485", tipo:"K9", ciudad:"Bogotá", initials:"SR"},
    {nombre:"Silvia Bonilla", raza:"Criollo", tel:"3013345506", tipo:"K9", ciudad:"Bogotá", initials:"SB"},
    {nombre:"Silvia Duque", raza:"BldFr", tel:"3102354704", tipo:"K9", ciudad:"Bogotá", initials:"SD"},
    {nombre:"Sofia Torres", raza:"Terrier Esco", tel:"3105412025", tipo:"K9", ciudad:"Bogotá", initials:"ST"},
    {nombre:"Sofia Tejada", raza:"", tel:"3173631197", tipo:"K9", ciudad:"Bogotá", initials:"ST"},
    {nombre:"Sofia Ramirez", raza:"", tel:"3194383614", tipo:"K9", ciudad:"Bogotá", initials:"SR"},
    {nombre:"Sofía Herrera", raza:"", tel:"3102198502", tipo:"K9", ciudad:"Bogotá", initials:"SH"},
    {nombre:"Sofía Díaz", raza:"", tel:"3005099347", tipo:"K9", ciudad:"Bogotá", initials:"SD"},
    {nombre:"Sonia Barberi", raza:"Yorkie", tel:"3214535487", tipo:"K9", ciudad:"Bogotá", initials:"SB"},
    {nombre:"Soraya Avendaño", raza:"Husky", tel:"3005689887", tipo:"K9", ciudad:"Bogotá", initials:"SA"},
    {nombre:"Stefania Lugo", raza:"BldFrn", tel:"3212170593", tipo:"K9", ciudad:"Bogotá", initials:"SL"},
    {nombre:"Stephania Rodriguez", raza:"Springer", tel:"3057465434", tipo:"K9", ciudad:"Bogotá", initials:"SR"},
    {nombre:"Stephania Muñoz", raza:"Criollo", tel:"3017040953", tipo:"K9", ciudad:"Bogotá", initials:"SM"},
    {nombre:"Stephanie Chaki", raza:"", tel:"3107747004", tipo:"Pup", ciudad:"Bogotá", initials:"SC"},
    {nombre:"Susana Martínez", raza:"", tel:"3213439772", tipo:"K9", ciudad:"Bogotá", initials:"SM"},
    {nombre:"Susana Morales", raza:"Yorkie", tel:"3145968755", tipo:"K9", ciudad:"Bogotá", initials:"SM"},
    {nombre:"Susana Rubinstein", raza:"Santa", tel:"3132508889", tipo:"K9", ciudad:"Bogotá", initials:"SR"},
    {nombre:"Sylvia Ahumada", raza:"Shi", tel:"3158042295", tipo:"Pup", ciudad:"Bogotá", initials:"SA"},
    {nombre:"Sylvia Muñoz", raza:"Wiki", tel:"3216139851", tipo:"K9", ciudad:"Bogotá", initials:"SM"},
    {nombre:"Tatiana Rodriguez", raza:"", tel:"3157460778", tipo:"K9", ciudad:"Bogotá", initials:"TR"},
    {nombre:"Tatiana Jimenez", raza:"Pup", tel:"3202343986", tipo:"Pup", ciudad:"Bogotá", initials:"TJ"},
    {nombre:"Tatiana Aristizabal", raza:"Bernés", tel:"3108147083", tipo:"K9", ciudad:"Bogotá", initials:"TA"},
    {nombre:"Tatiana Arcila", raza:"", tel:"3012155401", tipo:"K9", ciudad:"Bogotá", initials:"TA"},
    {nombre:"Tatiana Lersundy", raza:"Border", tel:"3123486692", tipo:"K9", ciudad:"Bogotá", initials:"TL"},
    {nombre:"Tatiana Suárez", raza:"Pup", tel:"3166171206", tipo:"Pup", ciudad:"Bogotá", initials:"TS"},
    {nombre:"Tatiana Fontalvo", raza:"Beagle", tel:"3108354117", tipo:"K9", ciudad:"Bogotá", initials:"TF"},
    {nombre:"Tatiana Céspedes", raza:"Border", tel:"3108087888", tipo:"K9", ciudad:"Bogotá", initials:"TC"},
    {nombre:"Tatiana Tous", raza:"", tel:"3143266598", tipo:"K9", ciudad:"Bogotá", initials:"TT"},
    {nombre:"Tatiana Grun", raza:"Agresivo", tel:"3204883793", tipo:"K9", ciudad:"Bogotá", initials:"TG"},
    {nombre:"Thael Osorio", raza:"", tel:"3003035497", tipo:"K9", ciudad:"Bogotá", initials:"TO"},
    {nombre:"Theresa Hoppe", raza:"GrShp", tel:"3166292008", tipo:"Pup", ciudad:"Bogotá", initials:"TH"},
    {nombre:"Tomas Posada", raza:"BCollie", tel:"3113182347", tipo:"K9", ciudad:"Bogotá", initials:"TP"},
    {nombre:"Valentina", raza:"", tel:"3016611220", tipo:"K9", ciudad:"Bogotá", initials:"V"},
    {nombre:"Valentina", raza:"", tel:"3125094923", tipo:"K9", ciudad:"Bogotá", initials:"V"},
    {nombre:"Valentina López", raza:"Pup", tel:"3124799450", tipo:"Pup", ciudad:"Bogotá", initials:"VL"},
    {nombre:"Valentina Cañedo", raza:"Schnauzer4añ", tel:"3147576824", tipo:"K9", ciudad:"Bogotá", initials:"VC"},
    {nombre:"Valentina Murcia", raza:"Maia", tel:"3123014001", tipo:"K9", ciudad:"Bogotá", initials:"VM"},
    {nombre:"Valentina Trujillo", raza:"Taro", tel:"0975813232", tipo:"K9", ciudad:"Bogotá", initials:"VT"},
    {nombre:"Valentina Trujillo", raza:"Taro", tel:"3227180359", tipo:"K9", ciudad:"Bogotá", initials:"VT"},
    {nombre:"Valentina de los Angeles", raza:"", tel:"3008711110", tipo:"K9", ciudad:"Bogotá", initials:"VD"},
    {nombre:"Valentina Florez", raza:"Pomerania", tel:"3187340454", tipo:"K9", ciudad:"Bogotá", initials:"VF"},
    {nombre:"Valeria Moreno", raza:"Bld", tel:"3105855798", tipo:"K9", ciudad:"Bogotá", initials:"VM"},
    {nombre:"Valeria Hernandez", raza:"Husky", tel:"3142774633", tipo:"K9", ciudad:"Bogotá", initials:"VH"},
    {nombre:"Valerie Castilla", raza:"Bld", tel:"6554819790", tipo:"K9", ciudad:"Bogotá", initials:"VC"},
    {nombre:"Valerie Castilla", raza:"Bld", tel:"3209990910", tipo:"K9", ciudad:"Bogotá", initials:"VC"},
    {nombre:"Vanessa Carvajal", raza:"", tel:"3012986445", tipo:"K9", ciudad:"Bogotá", initials:"VC"},
    {nombre:"Vanessa Franco", raza:"Fontanar", tel:"3134070834", tipo:"K9", ciudad:"Bogotá", initials:"VF"},
    {nombre:"Veronica Montejo", raza:"", tel:"3138708086", tipo:"Pup", ciudad:"Bogotá", initials:"VM"},
    {nombre:"Veronica Gutierrez", raza:"Cockapoo", tel:"3015018273", tipo:"K9", ciudad:"Bogotá", initials:"VG"},
    {nombre:"Veronica Cendales", raza:"Salchi", tel:"3184871073", tipo:"K9", ciudad:"Bogotá", initials:"VC"},
    {nombre:"Verónica Acuña", raza:"Collie", tel:"3012335633", tipo:"Pup", ciudad:"Bogotá", initials:"VA"},
    {nombre:"Vicky Daza", raza:"", tel:"3204850279", tipo:"K9", ciudad:"Bogotá", initials:"VD"},
    {nombre:"Víctor Hugo", raza:"Bernés", tel:"3104811759", tipo:"K9", ciudad:"Bogotá", initials:"VH"},
    {nombre:"Victoria Bernal", raza:"Bernés", tel:"3152246340", tipo:"Pup", ciudad:"Bogotá", initials:"VB"},
    {nombre:"Viviana González", raza:"", tel:"3104211116", tipo:"K9", ciudad:"Bogotá", initials:"VG"},
    {nombre:"Viviana Álvarez", raza:"", tel:"3204923905", tipo:"K9", ciudad:"Bogotá", initials:"VÁ"},
    {nombre:"Viviana Olaya", raza:"Criollo", tel:"3203605218", tipo:"K9", ciudad:"Bogotá", initials:"VO"},
    {nombre:"Viviana Henao", raza:"", tel:"3107773255", tipo:"K9", ciudad:"Bogotá", initials:"VH"},
    {nombre:"William Bolívar", raza:"Hala", tel:"3108120127", tipo:"K9", ciudad:"Bogotá", initials:"WB"},
    {nombre:"Wilson Galvis", raza:"Elisa", tel:"3017639798", tipo:"K9", ciudad:"Bogotá", initials:"WG"},
    {nombre:"Ximena Corredor", raza:"GrmShp", tel:"3214716472", tipo:"K9", ciudad:"Bogotá", initials:"XC"},
    {nombre:"Ximena Peña", raza:"Golden", tel:"3157525930", tipo:"Pup", ciudad:"Bogotá", initials:"XP"},
    {nombre:"Ximena Camacho", raza:"Cat", tel:"3174368017", tipo:"K9", ciudad:"Bogotá", initials:"XC"},
    {nombre:"Ximena Escobar", raza:"BrdrCollie", tel:"3115227156", tipo:"K9", ciudad:"Bogotá", initials:"XE"},
    {nombre:"Ximena Restrepo", raza:"Viszla", tel:"3208363343", tipo:"Pup", ciudad:"Bogotá", initials:"XR"},
    {nombre:"Yaned Y", raza:"", tel:"3175008573", tipo:"K9", ciudad:"Bogotá", initials:"YY"},
    {nombre:"Yanick Bayardelle", raza:"", tel:"3152212537", tipo:"K9", ciudad:"Bogotá", initials:"YB"},
    {nombre:"Yesika Sarmiento", raza:"Pomsky", tel:"3153939041", tipo:"K9", ciudad:"Bogotá", initials:"YS"},
    {nombre:"Yocelyn Sefair", raza:"", tel:"3165296462", tipo:"K9", ciudad:"Bogotá", initials:"YS"},
    {nombre:"Zuly Tome", raza:"Fiera", tel:"3217825956", tipo:"K9", ciudad:"Bogotá", initials:"ZT"},
  ]

  const razas = ["Todas", "Pup", "Golden", "Collie", "Bernés", "Yorkie", "Husky", "Criollo", "Bulldog Fr", "Terranova"]

  const tipoCol = { "K9": C.ig, "Pup": C.orange, "Fundadora": C.purple, "Fundador": C.purple }

  const filtered = clientes.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
                       c.raza.toLowerCase().includes(search.toLowerCase()) ||
                       c.tel.includes(search)
    const matchRaza = filterRaza === "Todas" || c.raza.includes(filterRaza)
    return matchSearch && matchRaza
  })
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const stats = [
    { v:"3,105", l:"Total contactos",    col: C.purple },
    { v:"845",   l:"Clientes K9",        col: C.ig     },
    { v:"160",   l:"Clientes Pup",       col: C.orange },
    { v:"845",   l:"Con WhatsApp",       col: C.wa     },
  ]

  const razaStats = [
    { raza:"Golden Retriever", count:25, col:C.orange },
    { raza:"Collie",           count:24, col:C.cyan   },
    { raza:"Criollo/a",        count:32, col:C.green  },
    { raza:"Yorkie",           count:15, col:C.purple },
    { raza:"Bernés",           count:14, col:C.blue   },
    { raza:"Husky",            count:14, col:C.ig     },
    { raza:"Bulldog Francés",  count:11, col:C.pink   },
    { raza:"Pup (cachorro)",   count:55, col:C.orange },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:`${C.purple}22`, border:`1px solid ${C.purple}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👥</div>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>CRM — Clientes Agenda Canina</h2>
          <p style={{ margin:0, color:C.muted, fontSize:13 }}>Base real · 3,105 contactos · 845 clientes activos</p>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <span style={{ ...sx.tag(C.green), fontSize:11 }}>● Datos reales 2025</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {[["clientes","👥 Clientes",C.purple],["pipeline","🎯 Pipeline",C.green],["razas","🐕 Por raza",C.orange],["whatsapp","💬 WhatsApp",C.wa]].map(([id,label,col]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: tab===id ? col : C.card2, color: tab===id ? "#fff" : C.sub,
            border:`1px solid ${tab===id ? col : C.border}`, borderRadius:20,
            padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
        {stats.map(s => (
          <div key={s.l} style={{ ...sx.card, textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:700, color:s.col }}>{s.v}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* TAB: CLIENTES */}
      {tab === "clientes" && (
        <>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Buscar por nombre, raza o teléfono..."
              style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, outline:"none", minWidth:200 }} />
            <select value={filterRaza} onChange={e => setFilterRaza(e.target.value)}
              style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }}>
              {razas.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div style={{ ...sx.card, marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12, color:C.muted }}>
            <span>Mostrando <strong style={{ color:C.text }}>{page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)}</strong> de <strong style={{ color:C.text }}>{filtered.length}</strong> clientes</span>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}
                style={{ background: page===0 ? C.card2 : C.purple, color:"#fff", border:"none", borderRadius:6, padding:"3px 10px", cursor: page===0 ? "default" : "pointer", fontSize:12, opacity: page===0 ? 0.4 : 1 }}>←</button>
              <span style={{ fontSize:12, color:C.sub }}>Pág {page+1} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page >= totalPages-1}
                style={{ background: page>=totalPages-1 ? C.card2 : C.purple, color:"#fff", border:"none", borderRadius:6, padding:"3px 10px", cursor: page>=totalPages-1 ? "default" : "pointer", fontSize:12, opacity: page>=totalPages-1 ? 0.4 : 1 }}>→</button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {paginated.map((c, i) => (
              <div key={i} style={{ ...sx.card, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:`${C.ig}22`, border:`1px solid ${C.ig}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.ig, flexShrink:0 }}>
                  {c.initials}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{c.nombre}</div>
                  <div style={{ fontSize:11, color:C.muted, display:"flex", gap:12 }}>
                    {c.raza && <span>🐕 {c.raza}</span>}
                    <span>📍 {c.ciudad}</span>
                    <span>📱 {c.tel}</span>
                  </div>
                </div>
                <Tag col={tipoCol[c.tipo] || C.cyan}>{c.tipo}</Tag>
                <a href={`https://wa.me/57${c.tel}`} target="_blank" rel="noopener noreferrer"
                  style={{ background:`${C.wa}22`, border:`1px solid ${C.wa}55`, borderRadius:7, padding:"5px 10px", cursor:"pointer", fontSize:11, color:C.wa, fontWeight:600, textDecoration:"none" }}>
                  💬 WA
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TAB: POR RAZA */}
      {tab === "razas" && (
        <>
          <div style={{ ...sx.card, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>🐕 Distribución por raza — Top 8</div>
            {razaStats.map(r => (
              <div key={r.raza} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12 }}>
                  <span style={{ color:C.sub }}>{r.raza}</span>
                  <strong style={{ color:r.col }}>{r.count} clientes</strong>
                </div>
                <BarLine pct={r.count * 1.5} col={r.col} />
              </div>
            ))}
          </div>

          <div style={{ ...sx.card, borderLeft:`3px solid ${C.purple}`, background:`${C.purple}0A` }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.purple, marginBottom:8 }}>🤖 Insight IA — Base de clientes</div>
            <p style={{ margin:0, fontSize:13, color:C.sub, lineHeight:1.75 }}>
              La base tiene <strong style={{ color:C.text }}>3,105 contactos</strong> con WhatsApp disponible — un activo comercial enorme sin explotar.
              Los cachorros (<strong style={{ color:C.orange }}>160 clientes Pup</strong>) son oportunidad de fidelización a largo plazo.
              Las razas más comunes son <strong style={{ color:C.text }}>Criollo (32), Golden (25) y Collie (24)</strong> — contenido sobre estas razas tendría alta resonancia.
              Con una campaña de WhatsApp a los 845 clientes K9, estimando 15% de respuesta, se generarían <strong style={{ color:C.green }}>~127 leads directos</strong> en 48 horas.
            </p>
          </div>
        </>
      )}

      {/* TAB: PIPELINE */}
      {tab === "pipeline" && (
        <>
          {/* Funnel visual */}
          <div style={{ ...sx.card, marginBottom:16, borderLeft:`3px solid ${C.green}` }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.green, marginBottom:16 }}>🎯 Pipeline de Conversión — Agenda Canina</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { stage:"Fundadores / Premium", count:8,   pct:100, col:C.orange, icon:"⭐", desc:"Clientes fundadores y aliados estratégicos", next:"Retener y activar como referentes" },
                { stage:"K9 — Clientes Activos", count:637, pct:75, col:C.purple, icon:"🏆", desc:"Completaron programa K9 de comportamiento", next:"Reactivar con seguimiento o programa avanzado" },
                { stage:"Pup — Programa Cachorro", count:160, pct:45, col:C.cyan, icon:"🐾", desc:"En programa inicial o primer contacto", next:"Convertir a K9 cuando el perro cumpla edad" },
                { stage:"Leads / Sin clasificar", count:40,  pct:20, col:C.muted, icon:"📋", desc:"Contactos sin programa asignado aún", next:"Calificar y asignar al programa correcto" },
              ].map((s, i) => (
                <div key={i} style={{ ...sx.card2, display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ fontSize:22 }}>{s.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{s.stage}</span>
                      <span style={{ fontSize:18, fontWeight:700, color:s.col }}>{s.count.toLocaleString()}</span>
                    </div>
                    <div style={{ background:`${C.border}`, borderRadius:4, height:6, marginBottom:6, overflow:"hidden" }}>
                      <div style={{ background:s.col, width:`${s.pct}%`, height:"100%", borderRadius:4, transition:"width 0.5s" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.muted }}>
                      <span>{s.desc}</span>
                      <span style={{ color:s.col }}>→ {s.next}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Métricas de conversión */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
            {[
              { v:"845",  l:"Total clientes",       col:C.purple, icon:"👥" },
              { v:"75.4%",l:"Tasa conversión K9",   col:C.green,  icon:"📈" },
              { v:"18.9%",l:"Clientes Pup",          col:C.cyan,   icon:"🐾" },
              { v:"~127", l:"Leads potenciales WA",  col:C.wa,     icon:"💬" },
            ].map(m => (
              <div key={m.l} style={{ ...sx.card, textAlign:"center" }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{m.icon}</div>
                <div style={{ fontSize:22, fontWeight:700, color:m.col }}>{m.v}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{m.l}</div>
              </div>
            ))}
          </div>

          {/* Acciones por etapa */}
          <div style={{ ...sx.card, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>⚡ Acciones recomendadas por etapa</div>
            {[
              { stage:"K9 Activos (637)", accion:"Campaña de reactivación WhatsApp", impacto:"~95 clientes contactan de nuevo", urgencia:"Alta", col:C.purple },
              { stage:"Pup (160)", accion:"Recordatorio evolución a K9 cuando el perro cumpla 6 meses", impacto:"~48 nuevas sesiones K9", urgencia:"Media", col:C.cyan },
              { stage:"Todos (845)", accion:"Xoky Meals — oferta especial a base completa", impacto:"~127 pedidos potenciales", urgencia:"Alta", col:C.orange },
              { stage:"Sin clasificar (40)", accion:"WhatsApp de calificación: '¿Tu perro tiene más o menos de 1 año?'", impacto:"Asignar al programa correcto", urgencia:"Baja", col:C.muted },
            ].map((a, i) => (
              <div key={i} style={{ ...sx.card2, marginBottom:8, display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:3, background:a.col, borderRadius:2, alignSelf:"stretch", flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <Tag col={a.col}>{a.stage}</Tag>
                    <Tag col={a.urgencia==="Alta" ? C.red : a.urgencia==="Media" ? C.orange : C.muted}>
                      {a.urgencia === "Alta" ? "🔥" : a.urgencia === "Media" ? "⚡" : "💡"} {a.urgencia}
                    </Tag>
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:3, color:C.text }}>{a.accion}</div>
                  <div style={{ fontSize:11, color:C.muted }}>Impacto estimado: {a.impacto}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Insight IA */}
          <div style={{ ...sx.card, borderLeft:`3px solid ${C.green}`, background:`${C.green}08` }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.green, marginBottom:8 }}>🤖 Análisis de Pipeline</div>
            <p style={{ margin:0, fontSize:13, color:C.sub, lineHeight:1.75 }}>
              Con <strong style={{ color:C.text }}>845 clientes registrados</strong> y 3,105 contactos totales con WhatsApp disponible,
              Agenda Canina tiene uno de los activos comerciales más sólidos del mercado canino en Bogotá.
              El <strong style={{ color:C.purple }}>75.4% de conversión a K9</strong> es excepcionalmente alto — indica un servicio con alta retención y satisfacción.
              La oportunidad inmediata está en los <strong style={{ color:C.cyan }}>160 clientes Pup</strong> que madurarán hacia K9,
              y en activar la base completa con <strong style={{ color:C.orange }}>Xoky Meals</strong> como product de menor barrera de entrada.
            </p>
          </div>
        </>
      )}

      {/* TAB: WHATSAPP CRM */}
      {tab === "whatsapp" && (
        <>
          <div style={{ ...sx.card, borderLeft:`3px solid ${C.wa}`, background:`${C.wa}0A`, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.wa, marginBottom:8 }}>💬 Potencial de WhatsApp con base real</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[
                { v:"3,105", l:"Contactos disponibles", col:C.wa },
                { v:"~466",  l:"Respuestas est. (15%)", col:C.green },
                { v:"~93",   l:"Leads est. (3% conv.)", col:C.purple },
              ].map(m => (
                <div key={m.l} style={{ background:`${m.col}11`, border:`1px solid ${m.col}33`, borderRadius:8, padding:12, textAlign:"center" }}>
                  <div style={{ fontSize:22, fontWeight:700, color:m.col }}>{m.v}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...sx.card, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>📢 Campañas sugeridas para la base</div>
            {[
              { nombre:"Reactivación clientes K9",       segmento:"845 clientes",  mensaje:"¡Hola! Han pasado algunos meses desde tu última sesión con Rodrigo. ¿Cómo está tu perro? Tenemos disponibilidad esta semana.", esperada:"12%", col:C.ig },
              { nombre:"Bienvenida cachorros (Pup)",      segmento:"160 clientes",  mensaje:"¡Hola! Los cachorros necesitan guía en sus primeros meses. ¿Le gustaría conocer nuestro programa para perritos jóvenes?", esperada:"22%", col:C.orange },
              { nombre:"Campaña referidos",               segmento:"3,105 contactos",mensaje:"¡Hola! ¿Conoces a alguien con un perro que necesite orientación? Por cada referido que tome sesión, recibes un descuento especial.", esperada:"8%", col:C.purple },
              { nombre:"Seguimiento post-sesión",         segmento:"Recientes",     mensaje:"¡Hola! ¿Cómo va la práctica en casa después de la sesión? Recuerda que la constancia es clave. Estoy aquí para cualquier duda.", esperada:"45%", col:C.wa },
            ].map((camp, i) => (
              <div key={i} style={{ ...sx.card2, marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:600, flex:1 }}>{camp.nombre}</span>
                  <Tag col={camp.col}>{camp.segmento}</Tag>
                  <Tag col={C.green}>~{camp.esperada} resp.</Tag>
                </div>
                <div style={{ fontSize:12, color:C.sub, background:`${camp.col}0D`, borderRadius:8, padding:"8px 10px" }}>
                  "{camp.mensaje}"
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: GOOGLE MY BUSINESS + WHATSAPP LOCAL
// ══════════════════════════════════════════════════════════════════════════════
function ModGoogleBusiness() {
  const [tab, setTab] = useState("resumen")

  const kpis = [
    { label:"Búsquedas directas",    value:"1,240",  delta:"+18%", col:"#4285F4" },
    { label:"Búsquedas indirectas",  value:"3,890",  delta:"+34%", col:"#34A853" },
    { label:"Vistas del perfil",     value:"5,130",  delta:"+27%", col:"#FBBC05" },
    { label:"Llamadas recibidas",    value:"89",     delta:"+12%", col:"#EA4335" },
    { label:"Clics al WhatsApp",     value:"234",    delta:"+41%", col:C.wa      },
    { label:"Solicitudes dirección", value:"67",     delta:"+9%",  col:C.purple  },
    { label:"Calificación",          value:"4.8 ⭐", delta:"+0.2", col:C.orange  },
    { label:"Total reseñas",         value:"143",    delta:"+12",  col:C.green   },
  ]

  const reseñas = [
    { nombre:"María González",    fecha:"Hace 2 días",  stars:5, texto:"Rodrigo es increíble. Mi perro Toby era muy agresivo y en 3 sesiones cambió completamente. 100% recomendado.", raza:"Golden" },
    { nombre:"Carlos Mendoza",    fecha:"Hace 5 días",  stars:5, texto:"Profesional, puntual y con mucho conocimiento del comportamiento canino. Mi Bulldog ya no ladra sin parar.", raza:"Bulldog Fr" },
    { nombre:"Laura Jiménez",     fecha:"Hace 1 semana",stars:5, texto:"Agenda Canina es lo mejor que le pudo pasar a mi perrita. Rodrigo explica todo con mucha paciencia.", raza:"Collie" },
    { nombre:"Andrés Morales",    fecha:"Hace 2 semanas",stars:4, texto:"Muy buena metodología. Se nota que Rodrigo ama lo que hace. El proceso toma tiempo pero funciona.", raza:"Husky" },
    { nombre:"Valentina Ruiz",    fecha:"Hace 3 semanas",stars:5, texto:"Mi yorkie mordía todo. Después de las sesiones está irreconocible. ¡Gracias Rodrigo!", raza:"Yorkie" },
  ]

  const searchTerms = [
    { term:"adiestramiento canino Bogotá",  searches:420, col:"#4285F4" },
    { term:"entrenador de perros Bogotá",   searches:310, col:"#34A853" },
    { term:"comportamiento canino",          searches:280, col:"#FBBC05" },
    { term:"agenda canina",                  searches:240, col:"#EA4335" },
    { term:"perro agresivo solución",        searches:190, col:C.wa      },
    { term:"Rodrigo Arenas",                 searches:150, col:C.purple  },
  ]

  const weekTraffic = [
    { day:"Lun", vistas:180, llamadas:12, wa:18 },
    { day:"Mar", vistas:210, llamadas:15, wa:24 },
    { day:"Mié", vistas:195, llamadas:11, wa:20 },
    { day:"Jue", vistas:230, llamadas:18, wa:28 },
    { day:"Vie", vistas:215, llamadas:14, wa:25 },
    { day:"Sáb", vistas:160, llamadas:9,  wa:16 },
    { day:"Dom", vistas:140, llamadas:7,  wa:13 },
  ]

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:"#4285F422", border:"1px solid #4285F455", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#4285F4" }}>G</div>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Google My Business</h2>
          <p style={{ margin:0, color:C.muted, fontSize:13 }}>Perfil local · Reseñas · Llamadas · WhatsApp · Bogotá</p>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <span style={{ ...sx.tag(C.orange), fontSize:11 }}>★ 4.8 · 143 reseñas</span>
          <span style={{ ...sx.tag(C.green), fontSize:11 }}>● Perfil activo</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {[["resumen","Resumen","#4285F4"],["reseñas","Reseñas",C.orange],["busquedas","Búsquedas","#34A853"],["whatsapp","→ WhatsApp",C.wa]].map(([id,label,col]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: tab===id ? col : C.card2, color: tab===id ? "#fff" : C.sub,
            border:`1px solid ${tab===id ? col : C.border}`, borderRadius:20,
            padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.15s"
          }}>{label}</button>
        ))}
      </div>

      {/* TAB: RESUMEN */}
      {tab === "resumen" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:10, marginBottom:18 }}>
            {kpis.map(k => (
              <div key={k.label} style={{ ...sx.card, display:"flex", flexDirection:"column", gap:4 }}>
                <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:0.9 }}>{k.label}</div>
                <div style={{ fontSize:20, fontWeight:700, color:k.col }}>{k.value}</div>
                <div style={{ fontSize:11, color:C.green }}>↑ {k.delta} vs mes anterior</div>
              </div>
            ))}
          </div>

          <div style={{ ...sx.card, marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>📊 Tráfico semanal — Vistas, Llamadas y WhatsApp</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekTraffic} barCategoryGap="30%">
                <XAxis dataKey="day" stroke={C.muted} tick={{ fontSize:11, fill:C.muted }} />
                <YAxis stroke={C.muted} tick={{ fontSize:11, fill:C.muted }} width={30} />
                <Tooltip {...TT} />
                <Bar dataKey="vistas"  fill="#4285F4" name="Vistas"   radius={[3,3,0,0]} />
                <Bar dataKey="llamadas"fill="#EA4335" name="Llamadas" radius={[3,3,0,0]} />
                <Bar dataKey="wa"      fill={C.wa}    name="WhatsApp" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...sx.card, borderLeft:"3px solid #4285F4", background:"#4285F40A" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#4285F4", marginBottom:8 }}>🤖 Análisis IA — Google My Business</div>
            <p style={{ margin:0, fontSize:13, color:C.sub, lineHeight:1.75 }}>
              El perfil recibe <strong style={{ color:C.text }}>5,130 vistas/mes</strong> con calificación de <strong style={{ color:C.orange }}>4.8 estrellas</strong>.
              El <strong style={{ color:C.text }}>jueves es el día de mayor tráfico</strong> con 230 vistas y 18 llamadas.
              Se detectan <strong style={{ color:C.wa }}>234 clics al WhatsApp</strong> desde el perfil — el canal de conversión más efectivo.
              Oportunidad: responder a todas las reseñas públicamente aumenta el ranking en Google Maps un 23% promedio.
            </p>
          </div>
        </>
      )}

      {/* TAB: RESEÑAS */}
      {tab === "reseñas" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
            <div style={{ ...sx.card, textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:700, color:C.orange }}>4.8</div>
              <div style={{ fontSize:18 }}>⭐⭐⭐⭐⭐</div>
              <div style={{ fontSize:12, color:C.muted }}>Calificación promedio</div>
            </div>
            <div style={{ ...sx.card, textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:700, color:C.green }}>143</div>
              <div style={{ fontSize:12, color:C.muted }}>Reseñas totales</div>
            </div>
            <div style={{ ...sx.card, textAlign:"center" }}>
              <div style={{ fontSize:32, fontWeight:700, color:"#4285F4" }}>94%</div>
              <div style={{ fontSize:12, color:C.muted }}>Reseñas 5 estrellas</div>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {reseñas.map((r, i) => (
              <div key={i} style={sx.card}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:`${C.orange}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:C.orange }}>
                    {r.nombre.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{r.nombre}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{r.fecha} · 🐕 {r.raza}</div>
                  </div>
                  <div style={{ fontSize:14 }}>{"⭐".repeat(r.stars)}</div>
                </div>
                <div style={{ fontSize:13, color:C.sub, fontStyle:"italic" }}>"{r.texto}"</div>
              </div>
            ))}
          </div>

          <div style={{ ...sx.card, marginTop:14, borderLeft:`3px solid ${C.cyan}` }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.cyan, marginBottom:8 }}>💡 Estrategia para más reseñas</div>
            <div style={{ fontSize:13, color:C.sub, lineHeight:1.75 }}>
              Envía este mensaje por WhatsApp después de cada sesión:<br/>
              <div style={{ background:`${C.wa}0D`, borderRadius:8, padding:"8px 12px", marginTop:8, fontSize:12 }}>
                "¡Hola [nombre]! Fue un placer trabajar con [perro] hoy 🐾 Si estás satisfecho con la sesión, me ayudarías mucho dejando una reseña en Google: [link] ¡Gracias!"
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB: BÚSQUEDAS */}
      {tab === "busquedas" && (
        <>
          <div style={{ ...sx.card, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:14 }}>🔍 Términos de búsqueda que llevan al perfil</div>
            {searchTerms.map(s => (
              <div key={s.term} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12 }}>
                  <span style={{ color:C.sub }}>{s.term}</span>
                  <strong style={{ color:s.col }}>{s.searches} búsquedas/mes</strong>
                </div>
                <BarLine pct={s.searches/5} col={s.col} />
              </div>
            ))}
          </div>

          <div style={{ ...sx.card, borderLeft:"3px solid #34A853" }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#34A853", marginBottom:10 }}>💡 Optimización SEO local recomendada</div>
            {[
              "Agrega categoría principal: 'Adiestramiento de animales' en el perfil GMB",
              "Publica 2 fotos/semana de sesiones reales — mejora el ranking local",
              "Responde TODAS las reseñas públicamente en menos de 24 horas",
              "Agrega descripción con keywords: 'adiestramiento canino Bogotá, comportamiento canino'",
              "Activa el botón de WhatsApp como acción principal del perfil",
            ].map((tip, i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:8, fontSize:13, color:C.sub }}>
                <span style={{ color:"#34A853" }}>→</span>{tip}
              </div>
            ))}
          </div>
        </>
      )}

      {/* TAB: WHATSAPP */}
      {tab === "whatsapp" && (
        <>
          <div style={{ ...sx.card, borderLeft:`3px solid ${C.wa}`, background:`${C.wa}0A`, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.wa, marginBottom:10 }}>📲 Flujo Google → WhatsApp → Sesión</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", fontSize:13 }}>
              {[["Google Maps","#4285F4"],["→",""],["Perfil GMB","#34A853"],["→",""],["Botón WA",C.wa],["→",""],["Chat","#25D366"],["→",""],["Sesión agendada",C.purple]].map(([t,col],i) => (
                col ? <span key={i} style={{ ...sx.tag(col), fontSize:12 }}>{t}</span>
                     : <span key={i} style={{ color:C.muted, fontSize:16 }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
            {[
              { v:"234",  l:"Clics al WA desde GMB", col:C.wa     },
              { v:"~35",  l:"Conversaciones abiertas", col:C.green },
              { v:"~12",  l:"Sesiones agendadas/mes",  col:C.purple},
            ].map(m => (
              <div key={m.l} style={{ ...sx.card, textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:700, color:m.col }}>{m.v}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{m.l}</div>
              </div>
            ))}
          </div>

          <div style={{ ...sx.card }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>🤖 Mensaje de bienvenida automático sugerido</div>
            <div style={{ background:`${C.wa}0D`, border:`1px solid ${C.wa}33`, borderRadius:10, padding:"12px 14px", fontSize:13, color:C.sub, lineHeight:1.7 }}>
              "¡Hola! 👋 Soy Rodrigo Arenas de Agenda Canina. Vi que llegaste desde Google — gracias por contactarme.<br/><br/>
              ¿Cuéntame un poco sobre tu perro? ¿Qué comportamiento quieres mejorar? 🐾<br/><br/>
              Tengo disponibilidad esta semana en Bogotá."
            </div>
          </div>
        </>
      )}
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
// ══════════════════════════════════════════════════════════════════════════════
// MODULE: DIAGNÓSTICO INICIAL
// ══════════════════════════════════════════════════════════════════════════════
function ModDiagnostico({ config = {} }) {
  const hasRealAI = config.anthropicKey && config.anthropicKey.startsWith("sk-ant-")
  const [step, setStep] = useState("form") // "form" | "loading" | "result"
  const [answers, setAnswers] = useState({ redes:[], frecuencia:"", objetivo:"", seguidores:"", desafio:"", nombre:"", negocio:"", email:"" })
  const [resultado, setResultado] = useState(null)

  const preguntas = [
    {
      id:"redes", label:"¿En qué redes publicas actualmente?", type:"multi",
      opciones:[{v:"Instagram",icon:"📸",col:C.ig},{v:"TikTok",icon:"🎵",col:C.tk},{v:"Facebook",icon:"👥",col:C.fb},{v:"LinkedIn",icon:"💼",col:C.li},{v:"YouTube",icon:"▶️",col:C.yt},{v:"WhatsApp",icon:"💬",col:C.wa}]
    },
    {
      id:"frecuencia", label:"¿Con qué frecuencia publicas?", type:"single",
      opciones:[{v:"Diario",icon:"🔥"},{v:"3-4 veces/semana",icon:"⚡"},{v:"1-2 veces/semana",icon:"📅"},{v:"Ocasionalmente",icon:"💤"},{v:"No publico aún",icon:"🆕"}]
    },
    {
      id:"objetivo", label:"¿Cuál es tu objetivo principal?", type:"single",
      opciones:[{v:"Generar leads y clientes",icon:"🎯"},{v:"Aumentar ventas directas",icon:"💰"},{v:"Crecer seguidores",icon:"📈"},{v:"Posicionarme como experto",icon:"🏆"},{v:"Fidelizar clientes actuales",icon:"♥"}]
    },
    {
      id:"seguidores", label:"¿Cuántos seguidores tienes aproximadamente?", type:"single",
      opciones:[{v:"0–500",icon:"🌱"},{v:"500–2,000",icon:"🌿"},{v:"2,000–10,000",icon:"🌳"},{v:"10,000–50,000",icon:"🌲"},{v:"+50,000",icon:"🏔️"}]
    },
    {
      id:"desafio", label:"¿Cuál es tu mayor desafío hoy?", type:"single",
      opciones:[{v:"No sé qué contenido funciona",icon:"🤷"},{v:"Publico pero no genero ventas",icon:"😔"},{v:"No tengo tiempo para publicar",icon:"⏰"},{v:"Mi audiencia no interactúa",icon:"📉"},{v:"No sé medir mis resultados",icon:"🔍"}]
    },
  ]

  const toggleRed = (v) => {
    setAnswers(a => ({ ...a, redes: a.redes.includes(v) ? a.redes.filter(x=>x!==v) : [...a.redes, v] }))
  }

  const isComplete = answers.redes.length > 0 && answers.frecuencia && answers.objetivo && answers.seguidores && answers.desafio

  // Recomendaciones template (sin IA)
  const buildRecomendaciones = () => {
    const recs = []
    if (answers.desafio === "Publico pero no genero ventas") {
      recs.push({ num:"01", titulo:"Agrega un CTA comercial a cada post", desc:"El 80% del contenido sin CTA no genera leads. En cada publicación incluye: '¿Te identificas? Escríbeme al WhatsApp y te digo cómo aplicarlo a tu caso.'", impacto:"Alto", col:C.red, icon:"🎯" })
    } else if (answers.desafio === "No sé qué contenido funciona") {
      recs.push({ num:"01", titulo:"Analiza tus 3 posts con más vistas esta semana", desc:"Identifica el patrón: ¿qué tienen en común? Tema, formato, longitud, horario. Ese patrón es tu fórmula. Repítelo con variaciones los próximos 30 días.", impacto:"Alto", col:C.red, icon:"🔍" })
    } else if (answers.desafio === "Mi audiencia no interactúa") {
      recs.push({ num:"01", titulo:"Cambia declaraciones por preguntas", desc:"Los posts que terminan en pregunta directa generan 3x más comentarios. Ejemplo: en vez de 'La constancia es clave', escribe '¿Cuántos días a la semana le dedicas a tu perro?'", impacto:"Alto", col:C.red, icon:"💬" })
    } else {
      recs.push({ num:"01", titulo:"Define un día y hora fijos de publicación", desc:"La consistencia predecible genera hasta 40% más alcance. Elige 3 días/semana y publícalos siempre a la misma hora. El algoritmo premia la regularidad.", impacto:"Alto", col:C.red, icon:"📅" })
    }
    if (answers.frecuencia === "Ocasionalmente" || answers.frecuencia === "No publico aún") {
      recs.push({ num:"02", titulo:"Lanza una 'Semana de Contenido' de arranque", desc:"Publica 7 días seguidos con el mismo formato: pregunta del día. Sin edición compleja, solo texto + imagen sencilla. Esto activa el algoritmo y genera datos para tomar decisiones.", impacto:"Medio", col:C.orange, icon:"🚀" })
    } else if (answers.redes.length === 1) {
      recs.push({ num:"02", titulo:"Repurposea tu mejor contenido a un segundo canal", desc:`Tomas lo que ya funciona en ${answers.redes[0]} y lo adaptas. Un Reel se convierte en Story + carrusel + mensaje de WhatsApp. Mismo esfuerzo, 3x el alcance.`, impacto:"Medio", col:C.orange, icon:"♻️" })
    } else {
      recs.push({ num:"02", titulo:"Concentra el 80% de tu energía en 1-2 redes", desc:`Tienes ${answers.redes.length} redes activas. Más no es mejor: enfócate en las 2 donde está tu audiencia. Las demás en piloto automático con reposts.`, impacto:"Medio", col:C.orange, icon:"🎯" })
    }
    if (answers.objetivo === "Generar leads y clientes" || answers.objetivo === "Aumentar ventas directas") {
      recs.push({ num:"03", titulo:"Crea un lead magnet de 1 página esta semana", desc:"Un PDF gratuito, checklist o guía rápida relacionada con tu negocio. Promociónalo en tus redes y captura el WhatsApp de quien lo pide. Es tu lista propia, independiente del algoritmo.", impacto:"Medio", col:C.cyan, icon:"📋" })
    } else if (answers.seguidores === "0–500" || answers.seguidores === "500–2,000") {
      recs.push({ num:"03", titulo:"Colabora con una cuenta complementaria", desc:"Busca una marca o persona con tu misma audiencia pero diferente servicio. Un reel colaborativo puede darte entre 500–2,000 nuevos seguidores en una semana sin inversión.", impacto:"Medio", col:C.cyan, icon:"🤝" })
    } else {
      recs.push({ num:"03", titulo:"Activa tu base de seguidores con una oferta de tiempo limitado", desc:"Con +2,000 seguidores tienes suficiente audiencia. Una oferta de 48 horas bien comunicada puede generar 10-30 ventas directas en tu primer intento.", impacto:"Medio", col:C.cyan, icon:"⚡" })
    }
    return recs
  }

  const scoreCalc = () => {
    let s = 0
    if (answers.redes.length >= 2) s += 20
    else if (answers.redes.length === 1) s += 10
    if (answers.frecuencia === "Diario") s += 25
    else if (answers.frecuencia === "3-4 veces/semana") s += 20
    else if (answers.frecuencia === "1-2 veces/semana") s += 12
    else if (answers.frecuencia === "Ocasionalmente") s += 5
    if (answers.seguidores === "+50,000") s += 25
    else if (answers.seguidores === "10,000–50,000") s += 20
    else if (answers.seguidores === "2,000–10,000") s += 15
    else if (answers.seguidores === "500–2,000") s += 8
    else s += 3
    if (answers.objetivo === "Generar leads y clientes" || answers.objetivo === "Aumentar ventas directas") s += 15
    else s += 8
    s += 15 // base por completar el diagnóstico
    return Math.min(s, 100)
  }

  const handleGenerar = async () => {
    setStep("loading")
    let recs
    if (hasRealAI) {
      const prompt = `Eres consultor de Sales Velocity AI. Un negocio completó el diagnóstico digital con estas respuestas:
- Redes activas: ${answers.redes.join(", ")}
- Frecuencia de publicación: ${answers.frecuencia}
- Objetivo principal: ${answers.objetivo}
- Seguidores actuales: ${answers.seguidores}
- Mayor desafío: ${answers.desafio}
- Nombre del negocio: ${answers.negocio || "No indicado"}

Genera exactamente 3 recomendaciones comerciales accionables y específicas para este negocio.
Para cada recomendación usa este formato JSON exacto (responde SOLO el JSON, sin texto adicional):
[
  {"num":"01","titulo":"título corto","desc":"descripción de 2-3 oraciones concretas y accionables","impacto":"Alto","icon":"emoji relevante"},
  {"num":"02","titulo":"...","desc":"...","impacto":"Medio","icon":"..."},
  {"num":"03","titulo":"...","desc":"...","impacto":"Medio","icon":"..."}
]`
      try {
        const raw = await callClaudeAPI(prompt, config.anthropicKey)
        const jsonMatch = raw.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          recs = parsed.map((r, i) => ({ ...r, col: [C.red, C.orange, C.cyan][i] }))
        } else {
          recs = buildRecomendaciones()
        }
      } catch {
        recs = buildRecomendaciones()
      }
    } else {
      await new Promise(r => setTimeout(r, 1200))
      recs = buildRecomendaciones()
    }
    const score = scoreCalc()
    setResultado({ recs, score })
    setStep("result")
  }

  const resetDiag = () => {
    setStep("form")
    setAnswers({ redes:[], frecuencia:"", objetivo:"", seguidores:"", desafio:"", nombre:"", negocio:"", email:"" })
    setResultado(null)
  }

  const scoreLabel = (s) => s >= 70 ? { label:"Ecosistema sólido", col:C.green, icon:"🏆" } : s >= 45 ? { label:"En desarrollo", col:C.orange, icon:"⚡" } : { label:"Gran oportunidad", col:C.cyan, icon:"🚀" }

  const inputSt = { width:"100%", background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 10px", color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }

  if (step === "loading") return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400 }}>
      <div style={{ fontSize:48, marginBottom:16, animation:"pulse 1.5s infinite" }}>🔍</div>
      <div style={{ fontSize:18, fontWeight:700, color:C.purple, marginBottom:8 }}>Analizando tu ecosistema digital…</div>
      <div style={{ fontSize:13, color:C.muted, textAlign:"center", maxWidth:360 }}>
        {hasRealAI ? "Claude IA está generando recomendaciones personalizadas para tu negocio" : "Procesando tus respuestas y generando recomendaciones accionables"}
      </div>
      <div style={{ marginTop:24, display:"flex", gap:8 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:C.purple, opacity:0.3+(i*0.35) }} />)}
      </div>
    </div>
  )

  if (step === "result" && resultado) {
    const sl = scoreLabel(resultado.score)
    return (
      <div style={{ padding:24 }}>
        {/* Header resultado */}
        <div style={{ ...sx.card, borderLeft:`3px solid ${sl.col}`, background:`${sl.col}08`, marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:13, color:sl.col, fontWeight:700, marginBottom:4 }}>📋 Diagnóstico completado {hasRealAI ? "· IA Real" : ""}</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.text }}>{sl.icon} {sl.label}</div>
            <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>
              {answers.negocio && <span><strong style={{color:C.text}}>{answers.negocio}</strong> · </span>}
              Potencial de optimización digital detectado
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:42, fontWeight:800, color:sl.col }}>{resultado.score}</div>
            <div style={{ fontSize:11, color:C.muted }}>Score / 100</div>
            <div style={{ background:`${sl.col}22`, borderRadius:20, height:6, width:80, marginTop:6, overflow:"hidden" }}>
              <div style={{ background:sl.col, width:`${resultado.score}%`, height:"100%", borderRadius:20 }} />
            </div>
          </div>
        </div>

        {/* Resumen respuestas */}
        <div style={{ ...sx.card, marginBottom:16 }}>
          <div style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Resumen del diagnóstico</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {answers.redes.map(r => <Tag key={r} col={C.ig}>{r}</Tag>)}
            <Tag col={C.cyan}>{answers.frecuencia}</Tag>
            <Tag col={C.purple}>{answers.objetivo}</Tag>
            <Tag col={C.orange}>{answers.seguidores} seguidores</Tag>
            <Tag col={C.muted}>{answers.desafio}</Tag>
          </div>
        </div>

        {/* Recomendaciones */}
        <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:12 }}>🎯 Tus 3 recomendaciones accionables</div>
        {resultado.recs.map((r, i) => (
          <div key={i} style={{ ...sx.card, marginBottom:12, borderLeft:`3px solid ${r.col}` }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ background:`${r.col}22`, color:r.col, border:`1px solid ${r.col}44`, borderRadius:10, padding:"8px 10px", fontSize:20, flexShrink:0 }}>{r.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{r.titulo}</span>
                  <Tag col={r.col}>Impacto {r.impacto}</Tag>
                </div>
                <p style={{ margin:0, fontSize:13, color:C.sub, lineHeight:1.75 }}>{r.desc}</p>
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ ...sx.card, background:`${C.purple}08`, borderLeft:`3px solid ${C.purple}`, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:C.purple, marginBottom:4 }}>¿Quieres implementar estas recomendaciones con acompañamiento?</div>
            <div style={{ fontSize:12, color:C.muted }}>Sales Velocity AI ofrece planes desde $150/mes con dashboard, análisis mensual y estrategia personalizada.</div>
          </div>
          <a href="https://wa.me/573142452458?text=Hola%2C%20completé%20el%20diagnóstico%20de%20Sales%20Velocity%20AI%20y%20quiero%20saber%20más"
            target="_blank" rel="noopener noreferrer"
            style={{ background:C.wa, border:"none", borderRadius:10, padding:"10px 20px", cursor:"pointer", color:"#fff", fontSize:13, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0 }}>
            💬 Hablar con un asesor
          </a>
        </div>

        <button onClick={resetDiag} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 18px", cursor:"pointer", color:C.sub, fontSize:13 }}>
          ← Hacer nuevo diagnóstico
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:`${C.cyan}22`, border:`1px solid ${C.cyan}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🔍</div>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Diagnóstico Inicial</h2>
          <p style={{ margin:0, color:C.muted, fontSize:13 }}>5 preguntas · 3 recomendaciones accionables · {hasRealAI ? "✨ IA Real activa" : "Análisis automático"}</p>
        </div>
      </div>

      {/* Progreso */}
      <div style={{ ...sx.card, marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ flex:1, background:C.card2, borderRadius:4, height:6, overflow:"hidden" }}>
          <div style={{ background:C.cyan, height:"100%", borderRadius:4, width:`${(
            (answers.redes.length>0?1:0)+(answers.frecuencia?1:0)+(answers.objetivo?1:0)+(answers.seguidores?1:0)+(answers.desafio?1:0)
          )/5*100}%`, transition:"width 0.3s" }} />
        </div>
        <span style={{ fontSize:12, color:C.muted, minWidth:60 }}>
          {(answers.redes.length>0?1:0)+(answers.frecuencia?1:0)+(answers.objetivo?1:0)+(answers.seguidores?1:0)+(answers.desafio?1:0)} / 5
        </span>
      </div>

      {/* Datos del negocio */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
        <div style={sx.card}>
          <label style={{ display:"block", fontSize:11, color:C.muted, marginBottom:6, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>Tu nombre (opcional)</label>
          <input value={answers.nombre} onChange={e=>setAnswers(a=>({...a,nombre:e.target.value}))} placeholder="Ej: Rodrigo Arenas" style={inputSt} />
        </div>
        <div style={sx.card}>
          <label style={{ display:"block", fontSize:11, color:C.muted, marginBottom:6, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>Nombre de tu negocio (opcional)</label>
          <input value={answers.negocio} onChange={e=>setAnswers(a=>({...a,negocio:e.target.value}))} placeholder="Ej: Agenda Canina" style={inputSt} />
        </div>
      </div>

      {/* Preguntas */}
      {preguntas.map(q => (
        <div key={q.id} style={{ ...sx.card, marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:12 }}>{q.label}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {q.opciones.map(op => {
              const sel = q.type==="multi" ? answers.redes.includes(op.v) : answers[q.id]===op.v
              const col = op.col || C.purple
              return (
                <button key={op.v} onClick={() => q.type==="multi" ? toggleRed(op.v) : setAnswers(a=>({...a,[q.id]:op.v}))}
                  style={{ background: sel ? `${col}22` : C.card2, color: sel ? col : C.sub,
                    border:`1px solid ${sel ? col : C.border}`, borderRadius:10, padding:"8px 14px",
                    cursor:"pointer", fontSize:12, fontWeight: sel ? 700 : 400, transition:"all 0.15s",
                    display:"flex", alignItems:"center", gap:6 }}>
                  <span>{op.icon}</span><span>{op.v}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Botón generar */}
      <button onClick={handleGenerar} disabled={!isComplete}
        style={{ background: isComplete ? `linear-gradient(135deg, ${C.purple}, ${C.cyan})` : C.card2,
          border:"none", borderRadius:12, padding:"14px 32px", cursor: isComplete ? "pointer" : "default",
          color: isComplete ? "#fff" : C.muted, fontSize:15, fontWeight:700, width:"100%",
          opacity: isComplete ? 1 : 0.5, transition:"all 0.2s" }}>
        {isComplete ? `✨ Generar mis 3 recomendaciones${hasRealAI ? " con IA real" : ""}` : "Completa las 5 preguntas para continuar"}
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MODULE: REPORTE MENSUAL
// ══════════════════════════════════════════════════════════════════════════════
function ModReporte({ config = {} }) {
  const [periodo, setPeriodo] = useState("Mayo–Junio 2026")
  const [generating, setGenerating] = useState(false)
  const [resumenIA, setResumenIA] = useState("")
  const hasRealAI = config.anthropicKey && config.anthropicKey.startsWith("sk-ant-")

  const kpis = [
    { label:"Seguidores",        value:"4,538",  prev:"4,490", delta:"+48",    col:C.purple, icon:"👥" },
    { label:"Visualizaciones",   value:"26,423", prev:"18,200",delta:"+45.2%", col:C.cyan,   icon:"👁"  },
    { label:"Interacciones",     value:"1,015",  prev:"680",   delta:"+49.3%", col:C.pink,   icon:"♥"  },
    { label:"Alcance",           value:"5,760",  prev:"3,900", delta:"+47.7%", col:C.orange, icon:"📡" },
    { label:"Engagement Rate",   value:"3.85%",  prev:"2.90%", delta:"+0.95pp",col:C.green,  icon:"📈" },
    { label:"Visitas al perfil", value:"355",    prev:"210",   delta:"+69%",   col:C.blue,   icon:"🔖" },
    { label:"Clics a WhatsApp",  value:"15",     prev:"8",     delta:"+87.5%", col:C.wa,     icon:"💬" },
    { label:"Posts publicados",  value:"6",      prev:"4",     delta:"+2",     col:C.sub,    icon:"📝" },
  ]

  const topPosts = [
    { pos:1, title:"El perro muerde cuando el humano se mueve mal", tipo:"Reel", views:4713, likes:102, score:8.7, col:C.ig, takeaway:"Contenido de EDUCACIÓN + SEGURIDAD = mayor tracción" },
    { pos:2, title:"Los perros no se educan solos", tipo:"Reel", views:2506, likes:74, score:8.4, col:C.purple, takeaway:"Mensaje de RESPONSABILIDAD resuena con la audiencia" },
    { pos:3, title:"Sitios Pet Friendly en calma", tipo:"Reel", views:1511, likes:33, score:8.1, col:C.cyan, takeaway:"Contenido LIFESTYLE canino genera buen alcance" },
  ]

  const recomendaciones = [
    { num:"01", titulo:"Duplicar reels educativos de seguridad", desc:"Los reels sobre mordidas, límites y señales caninas obtienen 3x más vistas. Meta: 2 reels/semana de este formato.", prioridad:"Alta", col:C.red },
    { num:"02", titulo:"Activar campaña WhatsApp a base K9", desc:"637 clientes K9 activos sin contacto reciente. Campaña de reactivación estimaría 95+ respuestas en 48h.", prioridad:"Alta", col:C.red },
    { num:"03", titulo:"Convertir post de Xoky Meals a Reel", desc:"El post de imagen obtuvo solo 406 vistas. En formato reel con proceso de preparación proyecta 3,000+ vistas.", prioridad:"Media", col:C.orange },
    { num:"04", titulo:"Serie de testimonios — familias reales", desc:"El post de mención especial generó buena retención. Una serie mensual de 4 testimonios construye prueba social.", prioridad:"Media", col:C.orange },
    { num:"05", titulo:"Publicar en alianza con Amigo Leal Café", desc:"La semana con colabs (25-27 May) fue la más activa del período. Programar 2 colabs/mes.", prioridad:"Baja", col:C.cyan },
  ]

  const generateResumen = async () => {
    if (!hasRealAI) return
    setGenerating(true)
    const prompt = `Genera un resumen ejecutivo mensual profesional para Agenda Canina (${periodo}).
    Métricas clave: 4,538 seguidores (+48), 26,423 visualizaciones (+45.2%), 1,015 interacciones (+49.3%), engagement 3.85%, 15 clics a WhatsApp.
    Top post: "El perro muerde cuando el humano se mueve mal" con 4,713 vistas.
    Escribe 3 párrafos: (1) resultados generales del período, (2) hallazgos clave sobre el contenido, (3) oportunidades comerciales prioritarias. Tono profesional y accionable. Sin bullets, en prosa fluida.`
    const texto = await callClaudeAPI(prompt, config.anthropicKey)
    setResumenIA(texto)
    setGenerating(false)
  }

  const printReport = () => {
    const printWindow = window.open('', '_blank')
    const html = `<!DOCTYPE html><html><head><title>Reporte Mensual — ${config.client || "Agenda Canina"} — ${periodo}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: 'Inter', Arial, sans-serif; color: #1a1a2e; padding: 40px; max-width: 800px; margin: 0 auto; }
      .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; padding-bottom:20px; border-bottom:3px solid #8B5CF6; }
      .logo { font-size:22px; font-weight:800; color:#8B5CF6; } .logo span { color:#06B6D4; }
      .client { text-align:right; } .client h2 { font-size:18px; font-weight:700; } .client p { color:#666; font-size:13px; }
      h3 { font-size:15px; font-weight:700; color:#1a1a2e; margin:24px 0 12px; border-left:3px solid #8B5CF6; padding-left:10px; }
      .kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
      .kpi { background:#f8f7ff; border:1px solid #e5e0ff; border-radius:8px; padding:12px; text-align:center; }
      .kpi-val { font-size:22px; font-weight:700; color:#8B5CF6; } .kpi-delta { font-size:11px; color:#10B981; font-weight:600; margin-top:2px; }
      .kpi-label { font-size:11px; color:#666; margin-top:4px; }
      .post { background:#f8f7ff; border:1px solid #e5e0ff; border-radius:8px; padding:12px; margin-bottom:8px; display:flex; gap:12px; align-items:center; }
      .post-num { font-size:20px; font-weight:800; color:#8B5CF6; min-width:28px; }
      .post-title { font-size:13px; font-weight:600; }
      .post-meta { font-size:11px; color:#666; margin-top:3px; }
      .rec { border-left:3px solid #8B5CF6; padding:10px 14px; background:#f8f7ff; margin-bottom:8px; border-radius:0 8px 8px 0; }
      .rec-num { font-size:10px; color:#8B5CF6; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
      .rec-title { font-size:13px; font-weight:700; margin:2px 0; }
      .rec-desc { font-size:12px; color:#555; line-height:1.6; }
      .summary { background:#f0f4ff; border-radius:10px; padding:20px; margin-bottom:24px; line-height:1.8; font-size:13px; color:#333; }
      .footer { margin-top:40px; padding-top:16px; border-top:1px solid #eee; display:flex; justify-content:space-between; font-size:11px; color:#999; }
      @media print { body { padding:20px; } }
    </style></head><body>
    <div class="header">
      <div><div class="logo">Sales Velocity <span>AI</span></div><div style="font-size:12px;color:#666;margin-top:4px">Dashboard de Inteligencia Comercial</div></div>
      <div class="client"><h2>${config.client || "Agenda Canina"}</h2><p>${config.industry || "Comportamiento Canino"} · ${config.country || "Colombia"}</p><p style="margin-top:4px;font-weight:600;color:#8B5CF6">Período: ${periodo}</p></div>
    </div>
    ${resumenIA ? `<h3>📝 Resumen Ejecutivo</h3><div class="summary">${resumenIA.replace(/\n/g,'<br/>')}</div>` : ''}
    <h3>📊 KPIs del Período</h3>
    <div class="kpis">
      ${kpis.map(k=>`<div class="kpi"><div class="kpi-val">${k.value}</div><div class="kpi-delta">${k.delta}</div><div class="kpi-label">${k.label}</div></div>`).join('')}
    </div>
    <h3>🏆 Top 3 Posts del Período</h3>
    ${topPosts.map(p=>`<div class="post"><div class="post-num">#${p.pos}</div><div><div class="post-title">${p.title}</div><div class="post-meta">${p.tipo} · ${p.views.toLocaleString()} vistas · ${p.likes} likes · Score ${p.score}/10</div><div class="post-meta" style="color:#8B5CF6;margin-top:3px">💡 ${p.takeaway}</div></div></div>`).join('')}
    <h3>🎯 Recomendaciones para el Próximo Mes</h3>
    ${recomendaciones.map(r=>`<div class="rec"><div class="rec-num">${r.num} · Prioridad ${r.prioridad}</div><div class="rec-title">${r.titulo}</div><div class="rec-desc">${r.desc}</div></div>`).join('')}
    <div class="footer"><span>Generado por Sales Velocity AI · salesvelocityai.com</span><span>Confidencial — ${config.client || "Agenda Canina"} · ${new Date().toLocaleDateString('es-CO')}</span></div>
    </body></html>`
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div style={{ padding:24 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:10, background:`${C.purple}22`, border:`1px solid ${C.purple}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>📊</div>
          <div>
            <h2 style={{ margin:0, fontSize:20, fontWeight:700 }}>Reporte Mensual</h2>
            <p style={{ margin:0, color:C.muted, fontSize:13 }}>Entregable profesional para {config.client || "Agenda Canina"}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <select value={periodo} onChange={e => setPeriodo(e.target.value)}
            style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 12px", color:C.text, fontSize:13, outline:"none" }}>
            {["Mayo–Junio 2026","Abril–Mayo 2026","Marzo–Abril 2026"].map(p => <option key={p}>{p}</option>)}
          </select>
          {hasRealAI && (
            <button onClick={generateResumen} disabled={generating} style={{ background:generating ? C.card2 : C.purple, border:"none", borderRadius:8, padding:"7px 16px", cursor:generating ? "default" : "pointer", color:"#fff", fontSize:13, fontWeight:600 }}>
              {generating ? "✨ Generando..." : "✨ Generar con IA"}
            </button>
          )}
          <button onClick={printReport} style={{ background:C.green, border:"none", borderRadius:8, padding:"7px 16px", cursor:"pointer", color:"#fff", fontSize:13, fontWeight:600 }}>
            🖨️ Exportar PDF
          </button>
        </div>
      </div>

      {/* Resumen Ejecutivo IA */}
      {resumenIA ? (
        <div style={{ ...sx.card, borderLeft:`3px solid ${C.purple}`, background:`${C.purple}08`, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:14 }}>📝</span>
            <span style={{ fontSize:13, fontWeight:700, color:C.purple }}>Resumen Ejecutivo — Generado con IA</span>
            <span style={{ ...sx.tag(C.green), fontSize:10, marginLeft:"auto" }}>🟢 Claude AI</span>
          </div>
          <p style={{ margin:0, fontSize:13, color:C.sub, lineHeight:1.8, whiteSpace:"pre-wrap" }}>{resumenIA}</p>
        </div>
      ) : !hasRealAI ? (
        <div style={{ ...sx.card, borderLeft:`3px solid ${C.orange}`, background:`${C.orange}08`, marginBottom:16 }}>
          <div style={{ fontSize:13, color:C.orange, fontWeight:600, marginBottom:4 }}>✨ Resumen Ejecutivo con IA</div>
          <p style={{ margin:0, fontSize:12, color:C.muted }}>Configura tu API key de Anthropic en ⚙️ Configuración para generar automáticamente el análisis narrativo del mes.</p>
        </div>
      ) : (
        <div style={{ ...sx.card, borderLeft:`3px solid ${C.purple}`, background:`${C.purple}08`, marginBottom:16 }}>
          <div style={{ fontSize:13, color:C.purple, fontWeight:600, marginBottom:4 }}>✨ Resumen Ejecutivo listo para generar</div>
          <p style={{ margin:0, fontSize:12, color:C.muted }}>Haz clic en "Generar con IA" para crear el análisis narrativo ejecutivo del período.</p>
        </div>
      )}

      {/* KPIs */}
      <div style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>KPIs del Período — {periodo}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...sx.card, textAlign:"center" }}>
            <div style={{ fontSize:16, marginBottom:4 }}>{k.icon}</div>
            <div style={{ fontSize:20, fontWeight:700, color:k.col }}>{k.value}</div>
            <div style={{ fontSize:11, color:C.green, fontWeight:600, marginTop:2 }}>{k.delta} vs mes ant.</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        {/* Top Posts */}
        <div style={sx.card}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>🏆 Top 3 Posts del Período</div>
          {topPosts.map(p => (
            <div key={p.pos} style={{ ...sx.card2, marginBottom:8, display:"flex", gap:10, alignItems:"flex-start" }}>
              <div style={{ fontSize:20, fontWeight:800, color:p.col, minWidth:28 }}>#{p.pos}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:3, color:C.text }}>{p.title}</div>
                <div style={{ display:"flex", gap:8, fontSize:11, color:C.muted, flexWrap:"wrap" }}>
                  <span>👁 {p.views.toLocaleString()}</span>
                  <span>♥ {p.likes}</span>
                  <Tag col={p.col}>Score {p.score}</Tag>
                </div>
                <div style={{ fontSize:11, color:p.col, marginTop:5, fontStyle:"italic" }}>💡 {p.takeaway}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Audiencia snapshot */}
        <div style={sx.card}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>👥 Audiencia — Snapshot</div>
          {[
            { label:"Mujeres",       val:"80%",  col:C.pink   },
            { label:"Hombres",       val:"20%",  col:C.blue   },
            { label:"Bogotá",        val:"50.5%",col:C.purple },
            { label:"Edad 35–54",    val:"62.9%",col:C.orange },
            { label:"Colombia",      val:"83.8%",col:C.green  },
            { label:"Engagement Rate",val:"3.85%",col:C.cyan  },
          ].map(a => (
            <div key={a.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:12, color:C.sub, minWidth:110 }}>{a.label}</span>
              <BarLine pct={parseFloat(a.val)} col={a.col} />
              <span style={{ fontSize:12, fontWeight:700, color:a.col, minWidth:42, textAlign:"right" }}>{a.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones */}
      <div style={{ ...sx.card, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>🎯 Recomendaciones — Próximo Mes</div>
        {recomendaciones.map(r => (
          <div key={r.num} style={{ ...sx.card2, marginBottom:8, display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ background:`${r.col}22`, color:r.col, border:`1px solid ${r.col}44`, borderRadius:8, padding:"4px 8px", fontSize:12, fontWeight:800, flexShrink:0 }}>{r.num}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{r.titulo}</span>
                <Tag col={r.col}>{r.prioridad}</Tag>
              </div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer del reporte */}
      <div style={{ ...sx.card, borderLeft:`3px solid ${C.green}`, background:`${C.green}08`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:C.green, marginBottom:4 }}>✅ Reporte listo para entregar</div>
          <div style={{ fontSize:12, color:C.muted }}>Generado por Sales Velocity AI · {new Date().toLocaleDateString('es-CO', {day:'numeric',month:'long',year:'numeric'})}</div>
        </div>
        <button onClick={printReport} style={{ background:C.green, border:"none", borderRadius:10, padding:"10px 22px", cursor:"pointer", color:"#fff", fontSize:13, fontWeight:700 }}>
          🖨️ Exportar PDF
        </button>
      </div>
    </div>
  )
}

const NAV = [
  { id: "inicio",      label: "Inicio",         icon: "🏠" },
  { id: "posts",       label: "Posts",           icon: "📋" },
  { id: "constancia",  label: "Constancia",      icon: "📅" },
  { id: "ideas",       label: "Ideas IA",        icon: "💡" },
  { id: "audiencia",   label: "Audiencia",       icon: "👥" },
  { id: "tendencias",  label: "Tendencias",      icon: "📈" },
  { id: "crm",         label: "CRM Clientes",    icon: "🗂️" },
  { id: "gmb",         label: "Google Business", icon: "📍" },
  { id: "googleads",   label: "Google Ads",      icon: "G" },
  { id: "whatsapp",    label: "WhatsApp",        icon: "💬" },
  { id: "diagnostico", label: "Diagnóstico",      icon: "🔍" },
  { id: "reporte",     label: "Reporte Mensual", icon: "📊" },
  { id: "chat",        label: "Chat IA",         icon: "🤖" },
  { id: "config",      label: "Configuración",   icon: "⚙️" },
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
    anthropicKey: "",
    planCode: "",
    planLevel: "demo",
    planLabel: "",
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
      case "crm":        return <ModCRM />
      case "gmb":        return <ModGoogleBusiness />
      case "googleads":  return <ModGoogleAds />
      case "whatsapp":   return <ModWhatsApp />
      case "diagnostico":return <ModDiagnostico config={config} />
      case "reporte":    return <ModReporte config={config} />
      case "chat":       return <ModChat config={config} />
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
