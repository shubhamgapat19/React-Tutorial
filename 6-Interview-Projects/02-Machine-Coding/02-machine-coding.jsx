// ========================================
// MACHINE CODING ROUND - Build from Scratch
// ========================================

import { useState, useRef, useEffect, useCallback } from 'react';

// ========================================
// 1. STAR RATING (Most Common)
// ========================================

function StarRating({ totalStars = 5, value = 0, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: totalStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hovered || value);

        return (
          <span
            key={i}
            className={`star ${isFilled ? 'filled' : ''}`}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            style={{ cursor: 'pointer', fontSize: '24px', color: isFilled ? '#fbbf24' : '#d1d5db' }}
          >
            ★
          </span>
        );
      })}
      <span className="rating-text">{value}/{totalStars}</span>
    </div>
  );
}

function StarRatingDemo() {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <h3>Rate this product:</h3>
      <StarRating value={rating} onChange={setRating} />
      <p>You rated: {rating} stars</p>
    </div>
  );
}

// ========================================
// 2. OTP INPUT (Very Common)
// ========================================

function OTPInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    // Check if complete
    const otpString = newOtp.join('');
    if (otpString.length === length) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, length - 1);
    inputs.current[focusIndex].focus();

    if (pasted.length === length) onComplete?.(pasted);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{ width: '40px', height: '48px', textAlign: 'center', fontSize: '20px', border: '2px solid #ccc', borderRadius: '8px' }}
        />
      ))}
    </div>
  );
}

// ========================================
// 3. COUNTDOWN TIMER
// ========================================

function CountdownTimer({ initialMinutes = 5 }) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100;

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => { setIsRunning(false); setTimeLeft(initialMinutes * 60); };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', fontFamily: 'monospace' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div style={{ width: '100%', height: '4px', background: '#eee', borderRadius: '2px', marginTop: '16px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', borderRadius: '2px', transition: 'width 1s' }} />
      </div>
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {!isRunning ? <button onClick={start}>Start</button> : <button onClick={pause}>Pause</button>}
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

// ========================================
// 4. TRANSFER LIST
// ========================================

function TransferList() {
  const [leftItems, setLeftItems] = useState([
    { id: 1, label: 'JavaScript' },
    { id: 2, label: 'TypeScript' },
    { id: 3, label: 'Python' },
    { id: 4, label: 'Go' },
    { id: 5, label: 'Rust' }
  ]);
  const [rightItems, setRightItems] = useState([]);
  const [leftSelected, setLeftSelected] = useState(new Set());
  const [rightSelected, setRightSelected] = useState(new Set());

  const toggleSelect = (id, selected, setSelected) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const moveRight = () => {
    const toMove = leftItems.filter(item => leftSelected.has(item.id));
    setRightItems(prev => [...prev, ...toMove]);
    setLeftItems(prev => prev.filter(item => !leftSelected.has(item.id)));
    setLeftSelected(new Set());
  };

  const moveLeft = () => {
    const toMove = rightItems.filter(item => rightSelected.has(item.id));
    setLeftItems(prev => [...prev, ...toMove]);
    setRightItems(prev => prev.filter(item => !rightSelected.has(item.id)));
    setRightSelected(new Set());
  };

  const ListPanel = ({ items, selected, setSelected }) => (
    <div style={{ border: '1px solid #ccc', padding: '8px', minWidth: '150px', minHeight: '200px' }}>
      {items.map(item => (
        <div key={item.id} onClick={() => toggleSelect(item.id, selected, setSelected)}
          style={{ padding: '4px 8px', cursor: 'pointer', background: selected.has(item.id) ? '#bfdbfe' : 'transparent', borderRadius: '4px', marginBottom: '2px' }}>
          <input type="checkbox" checked={selected.has(item.id)} readOnly />
          {item.label}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <ListPanel items={leftItems} selected={leftSelected} setSelected={setLeftSelected} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={moveRight} disabled={leftSelected.size === 0}>→</button>
        <button onClick={moveLeft} disabled={rightSelected.size === 0}>←</button>
      </div>
      <ListPanel items={rightItems} selected={rightSelected} setSelected={setRightSelected} />
    </div>
  );
}

// ========================================
// 5. PROGRESS BAR ON SCROLL
// ========================================

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', zIndex: 1000 }}>
      <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', transition: 'width 0.1s' }} />
    </div>
  );
}

// ========================================
// 6. MULTI-SELECT DROPDOWN
// ========================================

function MultiSelect({ options, value = [], onChange, placeholder = "Select..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) && !value.includes(opt.value)
  );

  const addItem = (item) => { onChange([...value, item]); setSearch(""); };
  const removeItem = (item) => { onChange(value.filter(v => v !== item)); };

  return (
    <div ref={ref} style={{ position: 'relative', width: '300px' }}>
      <div onClick={() => setIsOpen(true)} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '40px' }}>
        {value.map(v => {
          const opt = options.find(o => o.value === v);
          return (
            <span key={v} style={{ background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>
              {opt?.label}
              <button onClick={(e) => { e.stopPropagation(); removeItem(v); }} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
            </span>
          );
        })}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={value.length === 0 ? placeholder : ""} style={{ border: 'none', outline: 'none', flex: 1, minWidth: '60px' }} />
      </div>

      {isOpen && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, border: '1px solid #ccc', borderRadius: '6px', maxHeight: '200px', overflow: 'auto', background: 'white', listStyle: 'none', padding: '4px', margin: '4px 0', zIndex: 10 }}>
          {filtered.length === 0 ? <li style={{ padding: '8px', color: '#999' }}>No options</li> : (
            filtered.map(opt => (
              <li key={opt.value} onClick={() => addItem(opt.value)} style={{ padding: '8px', cursor: 'pointer', borderRadius: '4px' }}>
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

// ========================================
// 7. FILE EXPLORER (Recursive Tree)
// ========================================

function FileExplorer({ data }) {
  return (
    <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
      {data.map(item => <FileNode key={item.name} item={item} depth={0} />)}
    </div>
  );
}

function FileNode({ item, depth }) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.children && item.children.length > 0;
  const icon = isFolder ? (isOpen ? '📂' : '📁') : '📄';

  return (
    <div>
      <div onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${depth * 20}px`, padding: '4px', cursor: isFolder ? 'pointer' : 'default' }}>
        {icon} {item.name}
      </div>
      {isOpen && item.children?.map(child => (
        <FileNode key={child.name} item={child} depth={depth + 1} />
      ))}
    </div>
  );
}

// Usage data
const fileTreeData = [
  { name: 'src', children: [
    { name: 'components', children: [
      { name: 'Button.jsx', children: [] },
      { name: 'Card.jsx', children: [] }
    ]},
    { name: 'App.jsx', children: [] },
    { name: 'main.jsx', children: [] }
  ]},
  { name: 'package.json', children: [] },
  { name: 'vite.config.js', children: [] }
];

// ========================================
// TIMED PRACTICE CHALLENGES
// ========================================

// Set a timer and build each in the given time:

// 30 min: Star Rating with half-star support
// 30 min: OTP Input with paste + auto-submit
// 45 min: Autocomplete with keyboard navigation + API
// 45 min: Kanban board (3 columns, move cards)
// 60 min: Spreadsheet (editable cells, basic formulas)
// 60 min: Nested comments (like Reddit, add reply)

export { StarRating, OTPInput, CountdownTimer, TransferList, MultiSelect, FileExplorer };
