// ========================================
// ADVANCED COMPONENT PATTERNS - Practice
// ========================================

import { createContext, useContext, useState, forwardRef, createPortal, cloneElement, Children } from 'react';

// ========================================
// 1. COMPOUND COMPONENTS
// ========================================

const AccordionContext = createContext();

function Accordion({ children, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, children }) {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.has(id);

  return (
    <div className={`accordion-item ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
}

function AccordionHeader({ id, children }) {
  const { toggleItem } = useContext(AccordionContext);
  return (
    <button className="accordion-header" onClick={() => toggleItem(id)}>
      {children}
    </button>
  );
}

function AccordionBody({ id, children }) {
  const { openItems } = useContext(AccordionContext);
  if (!openItems.has(id)) return null;
  return <div className="accordion-body">{children}</div>;
}

// Attach sub-components
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

// Usage
function AccordionDemo() {
  return (
    <Accordion allowMultiple>
      <Accordion.Item id="1">
        <Accordion.Header id="1">Section 1</Accordion.Header>
        <Accordion.Body id="1">Content for section 1</Accordion.Body>
      </Accordion.Item>
      <Accordion.Item id="2">
        <Accordion.Header id="2">Section 2</Accordion.Header>
        <Accordion.Body id="2">Content for section 2</Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

// ========================================
// 2. COMPOUND TABS
// ========================================

const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div className="tab-list" role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      role="tab"
      className={activeTab === id ? "active" : ""}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== id) return null;
  return <div role="tabpanel">{children}</div>;
};

// Usage
function TabsDemo() {
  return (
    <Tabs defaultTab="overview">
      <Tabs.List>
        <Tabs.Tab id="overview">Overview</Tabs.Tab>
        <Tabs.Tab id="features">Features</Tabs.Tab>
        <Tabs.Tab id="pricing">Pricing</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="overview">Overview content here</Tabs.Panel>
      <Tabs.Panel id="features">Features content here</Tabs.Panel>
      <Tabs.Panel id="pricing">Pricing content here</Tabs.Panel>
    </Tabs>
  );
}

// ========================================
// 3. RENDER PROPS PATTERN
// ========================================

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: "300px", border: "1px solid" }}>
      {render(position)}
    </div>
  );
}

// Usage
function RenderPropsDemo() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          <p>Mouse: ({x}, {y})</p>
          <div style={{ position: "absolute", left: x, top: y, width: 20, height: 20, background: "red", borderRadius: "50%" }} />
        </div>
      )}
    />
  );
}

// ========================================
// 4. HIGHER-ORDER COMPONENT (HOC)
// ========================================

// HOC that adds loading state
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <div>Loading...</div>;
    return <WrappedComponent {...props} />;
  };
}

// HOC that adds auth check
function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const { user } = useContext(AuthContext); // Assume exists
    if (!user) return <p>Please login</p>;
    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage
function UserList({ users }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

const UserListWithLoading = withLoading(UserList);
// <UserListWithLoading isLoading={loading} users={users} />

// ========================================
// 5. PORTALS (Modals, Tooltips)
// ========================================

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
}

function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>This renders outside the component tree!</p>
      </Modal>
    </div>
  );
}

// ========================================
// 6. FORWARD REF
// ========================================

const CustomInput = forwardRef(function CustomInput({ label, ...props }, ref) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  );
});

function ForwardRefDemo() {
  const inputRef = useRef(null);

  return (
    <div>
      <CustomInput ref={inputRef} label="Username" placeholder="Enter username" />
      <button onClick={() => inputRef.current?.focus()}>Focus Input</button>
    </div>
  );
}

// ========================================
// 7. SLOT PATTERN
// ========================================

function PageLayout({ header, sidebar, children, footer }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="layout-body">
        <aside>{sidebar}</aside>
        <main>{children}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  );
}

// Usage
function Page() {
  return (
    <PageLayout
      header={<h1>My App</h1>}
      sidebar={<nav><a href="/">Home</a></nav>}
      footer={<p>© 2026</p>}
    >
      <p>Main content goes here</p>
    </PageLayout>
  );
}

// ========================================
// EXERCISES
// ========================================

// Exercise 1: Build a compound Dropdown component
// <Dropdown>
//   <Dropdown.Trigger>Click me</Dropdown.Trigger>
//   <Dropdown.Menu>
//     <Dropdown.Item>Option 1</Dropdown.Item>
//   </Dropdown.Menu>
// </Dropdown>

// Exercise 2: Build a Toast/Notification system using Portals
// - Toast renders at document body level
// - Auto-dismiss after 3 seconds
// - Stack multiple toasts

// Exercise 3: Build a Table with compound pattern
// <Table data={users}>
//   <Table.Column field="name" header="Name" />
//   <Table.Column field="email" header="Email" />
//   <Table.Column field="role" header="Role" render={v => <Badge>{v}</Badge>} />
// </Table>

export default AccordionDemo;
