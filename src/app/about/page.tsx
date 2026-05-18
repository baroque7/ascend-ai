export default function About() {
  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
      <h1 style={{color:'#FFD700',fontSize:'32px',fontWeight:'bold',marginBottom:'16px'}}>About GramScaling</h1>
      <p style={{color:'#999',fontSize:'16px',maxWidth:'400px',lineHeight:'1.8',marginBottom:'16px'}}>We help creators grow their US audience by creating and managing their TikTok and Instagram accounts from American devices.</p>
      <p style={{color:'#999',fontSize:'16px',maxWidth:'400px',lineHeight:'1.8',marginBottom:'32px'}}>Our AI tells you exactly what to post every day and we post it automatically from a US device so the algorithm treats you like a US creator.</p>
      <a href="/" style={{color:'#FFD700',textDecoration:'none',fontSize:'16px'}}>← Back Home</a>
    </div>
  )
}