
const Collapse = ({ isCollapse, handleCollapseClick }) => {
  return (
    <div className='expand-box' onClick={handleCollapseClick}>
      <a>
        {isCollapse ? <img className='expand-icon' src='/collapse-down.svg' /> : <img className='expand-icon' src='/collapse-up.svg' />}
      </a>
      <style jsx>{`
    .expand-box {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: center;
      cursor: pointer;
      width: 100%;
      
      padding: 0.5rem 0;
    }
    
    .expand-icon {
      align-self: center;
      width: 18px;
      height: 18px;
    }
    
    `}
      </style>
    </div>
  )
}
export default Collapse
