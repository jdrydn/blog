'use client'
import { useState, useEffect } from 'react'

export default function useObscuredValue(pairs: [string, string][]) {
  const [value, setValue] = useState(pairs.map(([left]) => left).join(''))
    
  useEffect(() => {
    // 2.8 Conversion JS
    // "Despite being frighteningly simple, this is expected to be one of the very best techniques"
    // @link https://spencermortensen.com/articles/email-obfuscation
    if (!value.startsWith(pairs[0][1])) {
      setValue(pairs.map(([, right]) => right).join(''))
    }
  }, [])

  return value
}
