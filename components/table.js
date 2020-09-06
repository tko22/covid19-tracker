import { useState } from 'react'
import ToggleNormalize from './toggleNormalize'
const NORMALIZATION_FACTOR = 100000

const Table = ({ title, children, isCollapse, handleCollapseClick, handleNormalizeClick, isNormalized }) => {
  return (
    <div className='table-wrapper'>

      <div className='title-box'>
        <h3>{title}</h3>
        <ToggleNormalize isNormalized={isNormalized} toggle={handleNormalizeClick} />
      </div>
      <table className='state-history-table'>
        {children}
      </table>
      <div className='expand-box' onClick={handleCollapseClick}>
        <a>
          {isCollapse ? <img className='expand-icon' src='/collapse-down.svg' /> : <img className='expand-icon' src='/collapse-up.svg' />}
        </a>
      </div>

      <style jsx>{`
      .title-box {
        display: flex;
        align-items: center;
      }

      .title-box h3 {
        flex: 2;
      }
      
      .table-wrapper {
        margin: 1rem;
        padding: 1.5rem 1.5rem 0.5rem 1.5rem;
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;

        
        text-align: left;
        font-color: #545454;
        display: inline-block;
        overflow-x:auto !important;
      }

      .table-wrapper:hover {
        box-shadow: rgba(0, 0, 0, 0.12) 2px 2px 8px;
        transition: border 0.2s, background 0.2s, color 0.2s ease-out;
      }

      h3 {
        margin: 5px;
      }
    
      .state-history-table {
        font-size: 13px;
        border-color: grey;
        
        table-layout:fixed;
        overflow-x:auto !important;
      }
      
      .state-history-table thead {
        text-transform: uppercase;
        border: 1px solid #eaeaea;
      }
      
      .state-history-table th {
        padding: 0.6em;
        font-weight: 500;
        font-size: 12px;
        color: #878787;
      }

      .state-history-table td {
        padding: 0.6rem;
        max-width:100%;
        white-space:nowrap;
      }

      .expand-box {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        justify-content: center;
        cursor: pointer;
        width: 100%;
      }

      .expand-icon {
        align-self: center;
        width: 18px;
        height: 18px;
      }

      .stat-row {
        display: flex;
        justify-content: left;
      }
      
      .stat-val {
        margin: 0;
        margin-right: auto;
        text-align: left;
        align-self: center;
        flex-basis: 40px;
      }

      .stat-diff {
        align-self: center;
        text-align: left;
        flex: 10%;
        padding-left: 3px;
        
        display: flex;
        display:-webkit-flex
        -webkit-box-pack: justify;
        align-items: left;
      }

      .stat-diff p {
        font-size: 9px !important;
        margin: 0;
        flex: 1;
        text-align: right;
      }

      .stat-incr-icon {
        width: 10px;
        height: 10px;
        align-self: flex-start;
        margin-right: auto;
      }

    `}
      </style>
    </div>
  )
}

export default Table
