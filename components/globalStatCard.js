
const GlobalStatCard = () => (
  <div>
    Hello
    <style jsx>{`
      .card {
        margin: 1rem;
        flex-basis: 30%;
        
        padding: 1.5rem;
        color: inherit;
        min-width: 300px;
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;
      }

      .card:hover,
      .card:focus,
      .card:active {
        box-shadow: rgba(0, 0, 0, 0.12) 2px 2px 8px;
        transition: border 0.2s, background 0.2s, color 0.2s ease-out;
      }
    `}
    </style>
  </div>
)

export default GlobalStatCard
