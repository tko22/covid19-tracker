
const ToggleNormalize = ({ isNormalized, toggle }) => (
  <div className='toggle-box'>
    {
      isNormalized
        ? <>
          <p>per 10,000</p>
          <img className='toggle-icon' src='/toggle-right.svg' onClick={toggle} />
          </>
        : <>
          <p>cases</p>
          <img className='toggle-icon' src='/toggle-left.svg' onClick={toggle} />
          </>
    }
    <style jsx>{`
      .toggle-box {
        display: flex;
      }

      .toggle-box p {
        font-size: 12px;
        color: #ababab;
        padding-right: 5px;
        font-size: 12px;
        color: #ababab;
        padding-right: 5px;
        margin: 4px 0;
      }

      .toggle-icon {
        cursor: pointer;
        align-self: center;
      }
    
    `}
    </style>
  </div>
)

export default ToggleNormalize
