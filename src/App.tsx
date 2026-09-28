import React, { useState, useEffect } from 'react';
import { 
  CameraAngle, 
  ColorSwatch, 
  GarmentZone, 
  LightingMode, 
  StudioState, 
  TimelineEntry, 
  WeaveItem, 
  CartItem,
  ButtonFinish
} from './types';
import { 
  WEAVE_ITEMS, 
  COLOR_SWATCHES, 
  INITIAL_STUDIO_STATE, 
  PATTERN_ITEMS 
} from './data/studioData';
import { Header } from './components/Header';
import { GarmentViewer } from './components/GarmentViewer';
import { LeftPatternPanel } from './components/LeftPatternPanel';
import { RightWeaveColorPanel } from './components/RightWeaveColorPanel';
import { BottomBar } from './components/BottomBar';
import { FooterTimeline } from './components/FooterTimeline';
import { ExportOrderModal } from './components/ExportOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { SwatchKitModal } from './components/SwatchKitModal';

export default function App() {
  // Current studio state
  const [state, setState] = useState<StudioState>(INITIAL_STUDIO_STATE);

  // Customization timeline history
  const [timeline, setTimeline] = useState<TimelineEntry[]>([
    {
      id: 'init-1',
      timestamp: Date.now() - 1000 * 60 * 3,
      title: 'Initial Atelier Drape',
      detail: 'Satin Silk in Emerald Green',
      category: 'weave',
      state: INITIAL_STUDIO_STATE,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSwatchKitOpen, setIsSwatchKitOpen] = useState<boolean>(false);

  // Calculate live bespoke price based on selections
  const basePrice = 285;
  const currentWeave = WEAVE_ITEMS.find((w) => w.id === state.weave) || WEAVE_ITEMS[0];
  const weaveSurplus = state.weave === 'jacquard-silk' ? 45 : state.weave === 'herringbone-tweed' ? 35 : 0;
  const shotSilkSurplus = state.isShotSilk ? 30 : 0;
  const patternSurplus = state.pattern !== 'solid-pure' ? 25 : 0;
  const computedPrice = basePrice + weaveSurplus + shotSilkSurplus + patternSurplus;

  // Push record to timeline
  const recordHistory = (title: string, detail: string, category: TimelineEntry['category'], newState: StudioState) => {
    const newEntry: TimelineEntry = {
      id: `step-${Date.now()}`,
      timestamp: Date.now(),
      title,
      detail,
      category,
      state: newState,
    };
    const newHistory = [...timeline.slice(0, historyIndex + 1), newEntry].slice(-15);
    setTimeline(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Weave selection
  const handleSelectWeave = (weave: WeaveItem) => {
    const newState = { ...state, weave: weave.id };
    setState(newState);
    recordHistory(`Weave: ${weave.name}`, `${weave.weightGsm} GSM ${weave.category}`, 'weave', newState);
  };

  // Color selection
  const handleSelectColor = (color: ColorSwatch) => {
    const newState = { ...state, selectedColor: color };
    setState(newState);
    recordHistory(`Color: ${color.name}`, color.pantone, 'color', newState);
  };

  // Secondary weft color for shot silk
  const handleSelectSecondaryWeft = (hex: string) => {
    const newState = { ...state, secondaryWeftColor: hex };
    setState(newState);
  };

  // Toggle shot silk
  const handleToggleShotSilk = (enabled: boolean) => {
    const newState = { ...state, isShotSilk: enabled };
    setState(newState);
    recordHistory(enabled ? 'Shot-Silk Active' : 'Solid Yarn Dye', 'Iridescent two-tone', 'detail', newState);
  };

  // Sheen adjust
  const handleSheenAdjust = (val: number) => {
    setState((prev) => ({ ...prev, sheenAdjust: val }));
  };

  // Button finish
  const handleSelectButtonFinish = (finish: ButtonFinish) => {
    const newState = { ...state, buttonFinish: finish };
    setState(newState);
    recordHistory(`Buttons: ${finish}`, 'Fastener hardware', 'detail', newState);
  };

  // Pattern selection
  const handleSelectPattern = (patternId: string) => {
    const pat = PATTERN_ITEMS.find((p) => p.id === patternId);
    const newState = { ...state, pattern: patternId };
    setState(newState);
    recordHistory(`Pattern: ${pat?.name || 'Textile'}`, 'Applied print repeat', 'pattern', newState);
  };

  // Pattern sliders
  const handlePatternScaleChange = (scale: number) => {
    setState((prev) => ({ ...prev, patternScale: scale }));
  };
  const handlePatternRotationChange = (rotation: number) => {
    setState((prev) => ({ ...prev, patternRotation: rotation }));
  };
  const handlePatternOpacityChange = (opacity: number) => {
    setState((prev) => ({ ...prev, patternOpacity: opacity }));
  };

  // Camera angle
  const handleCameraAngleChange = (angle: CameraAngle) => {
    const newState = { ...state, cameraAngle: angle };
    setState(newState);
    recordHistory(`Angle: ${angle}`, 'Camera viewpoint', 'angle', newState);
  };

  // Lighting
  const handleLightingChange = (mode: LightingMode) => {
    const newState = { ...state, lighting: mode };
    setState(newState);
    recordHistory(`Lighting: ${mode}`, 'Atmospheric illumination', 'lighting', newState);
  };

  // Zone selection
  const handleZoneSelect = (zone: GarmentZone) => {
    setState((prev) => ({ ...prev, activeZone: zone }));
  };

  // Timeline jump
  const handleJumpToIndex = (index: number) => {
    if (timeline[index]) {
      setHistoryIndex(index);
      setState(timeline[index].state);
    }
  };

  // Undo / Redo / Reset
  const handleUndo = () => {
    if (historyIndex > 0) {
      handleJumpToIndex(historyIndex - 1);
    }
  };
  const handleRedo = () => {
    if (historyIndex < timeline.length - 1) {
      handleJumpToIndex(historyIndex + 1);
    }
  };
  const handleReset = () => {
    setState(INITIAL_STUDIO_STATE);
    recordHistory('Reset to Atelier Baseline', 'Default Charmeuse setup', 'weave', INITIAL_STUDIO_STATE);
  };

  // Cart operations
  const handleAddToCart = (item: {
    weaveName: string;
    colorName: string;
    pantone: string;
    colorHex: string;
    patternName: string;
    buttonFinish: string;
    size: string;
    price: number;
  }) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      title: 'Custom Silk Atelier Blouse',
      ...item,
      quantity: 1,
      thumbnail: '',
      timestamp: Date.now(),
    };
    setCartItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F2EB] text-[#1A1918]">
      
      {/* 1. Header with Brand, Search Bar, Account & Cart */}
      <Header
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSwatchKit={() => setIsSwatchKitOpen(true)}
        onSelectWeave={handleSelectWeave}
        onSelectColor={handleSelectColor}
        onSelectPattern={handleSelectPattern}
      />

      {/* 2. Main Studio Workspace: 3-Column Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Pattern & Print */}
        <LeftPatternPanel
          selectedPatternId={state.pattern}
          onSelectPattern={handleSelectPattern}
          patternScale={state.patternScale}
          onPatternScaleChange={handlePatternScaleChange}
          patternRotation={state.patternRotation}
          onPatternRotationChange={handlePatternRotationChange}
          patternOpacity={state.patternOpacity}
          onPatternOpacityChange={handlePatternOpacityChange}
        />

        {/* Center: Main Canvas with 3D Mannequin & Real-time Customization */}
        <GarmentViewer
          weave={currentWeave}
          color={state.selectedColor}
          secondaryWeftColor={state.secondaryWeftColor}
          isShotSilk={state.isShotSilk}
          patternId={state.pattern}
          patternScale={state.patternScale}
          patternRotation={state.patternRotation}
          patternOpacity={state.patternOpacity}
          cameraAngle={state.cameraAngle}
          lighting={state.lighting}
          sheenAdjust={state.sheenAdjust}
          buttonFinish={state.buttonFinish}
          activeZone={state.activeZone}
          onZoneSelect={handleZoneSelect}
          onAngleChange={handleCameraAngleChange}
          onDropPattern={handleSelectPattern}
        />

        {/* Right Panel: Weave & Color */}
        <RightWeaveColorPanel
          selectedWeave={currentWeave}
          onSelectWeave={handleSelectWeave}
          selectedColor={state.selectedColor}
          onSelectColor={handleSelectColor}
          secondaryWeftColor={state.secondaryWeftColor}
          onSelectSecondaryWeft={handleSelectSecondaryWeft}
          isShotSilk={state.isShotSilk}
          onToggleShotSilk={handleToggleShotSilk}
          sheenAdjust={state.sheenAdjust}
          onSheenAdjustChange={handleSheenAdjust}
          buttonFinish={state.buttonFinish}
          onSelectButtonFinish={handleSelectButtonFinish}
        />

      </main>

      {/* 3. Bottom Bar: Camera Angle, Lighting, and Export & Order */}
      <BottomBar
        cameraAngle={state.cameraAngle}
        onCameraAngleChange={handleCameraAngleChange}
        lighting={state.lighting}
        onLightingChange={handleLightingChange}
        onOpenExportOrder={() => setIsExportModalOpen(true)}
        price={computedPrice}
      />

      {/* 4. Footer: Subtly Visible Customization Timeline */}
      <FooterTimeline
        timeline={timeline}
        currentIndex={historyIndex}
        onJumpToIndex={handleJumpToIndex}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
      />

      {/* 5. Modals & Drawers */}
      <ExportOrderModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        weave={currentWeave}
        color={state.selectedColor}
        secondaryWeftColor={state.secondaryWeftColor}
        isShotSilk={state.isShotSilk}
        patternId={state.pattern}
        patternScale={state.patternScale}
        patternRotation={state.patternRotation}
        buttonFinish={state.buttonFinish}
        price={computedPrice}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />

      <SwatchKitModal
        isOpen={isSwatchKitOpen}
        onClose={() => setIsSwatchKitOpen(false)}
      />

    </div>
  );
}
