import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

class Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  size: number = 0;
  life: number = 0;
  maxLife: number = 0;
  color: string = '';
  rotation: number = 0;
  rotationSpeed: number = 0;
  type: string = 'circle';
  theme: string = '';
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  seed: number = 0; // For sine wave offset

  constructor(theme: string, canvasWidth: number, canvasHeight: number, primaryColor: string) {
    this.theme = theme;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset(primaryColor, true);
  }

  reset(primaryColor: string, initialSpawn: boolean = false) {
    this.seed = Math.random() * Math.PI * 2;

    if (this.theme === 'hearth') {
      this.type = 'glow';
      this.size = Math.random() * 4 + 2;
      this.x = Math.random() * this.canvasWidth;
      // Spawn at bottom, or randomly throughout if initial
      this.y = initialSpawn ? Math.random() * this.canvasHeight : this.canvasHeight + this.size;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -Math.random() * 1.5 - 0.5;
      this.life = 0;
      this.maxLife = Math.random() * 100 + 100;
      this.color = primaryColor; // e.g. #E87A3E
    }
    else if (this.theme === 'forager') {
      this.type = 'leaf';
      this.size = Math.random() * 6 + 4;
      this.x = Math.random() * this.canvasWidth;
      this.y = initialSpawn ? Math.random() * this.canvasHeight : -this.size;
      this.vx = 0; // handled by sine wave
      this.vy = Math.random() * 1 + 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 200;
      this.color = primaryColor;
    }
    else if (this.theme === 'neon') {
      this.type = 'rain';
      this.size = Math.random() * 20 + 10; // length of rain
      this.x = Math.random() * this.canvasWidth;
      this.y = initialSpawn ? Math.random() * this.canvasHeight : -this.size;
      this.vx = 0;
      this.vy = Math.random() * 10 + 5;
      this.life = 0;
      this.maxLife = 1000; // Lives until offscreen
      // Randomly choose cyan or hot pink
      this.color = Math.random() > 0.5 ? '#00FFFF' : '#FF003C';
    }
    else if (this.theme === 'royal') {
      this.type = 'sprinkle';
      this.size = Math.random() * 4 + 2;
      this.x = Math.random() * this.canvasWidth;
      this.y = initialSpawn ? Math.random() * this.canvasHeight : -this.size;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = Math.random() * 2 + 1;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      this.life = 0;
      this.maxLife = 1000;
      const colors = ['#C28E8E', '#D4AF37', '#FFF5F5', '#E8D0D0'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    else if (this.theme === 'chromatic') {
      this.type = 'hexagon';
      this.size = Math.random() * 15 + 10;
      this.x = Math.random() * this.canvasWidth;
      this.y = initialSpawn ? Math.random() * this.canvasHeight : this.canvasHeight + this.size;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -Math.random() * 1 - 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.color = primaryColor;
    }
    else if (this.theme === 'astral') {
      // 90% static stars, 10% shooting stars
      if (Math.random() > 0.9) {
        this.type = 'shooting_star';
        this.size = Math.random() * 2 + 1;
        this.x = Math.random() * this.canvasWidth;
        this.y = initialSpawn ? Math.random() * this.canvasHeight : -10;
        this.vx = -Math.random() * 10 - 5;
        this.vy = Math.random() * 10 + 5;
        this.life = 0;
        this.maxLife = 1000;
        this.color = primaryColor; // e.g. Starlight Gold
      } else {
        this.type = 'star';
        this.size = Math.random() * 1.5 + 0.5;
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.vx = 0;
        this.vy = 0;
        this.life = Math.random() * Math.PI * 2; // used for twinkle phase
        this.maxLife = Infinity;
        this.color = Math.random() > 0.5 ? '#F3E8FF' : '#9D84B7'; // Soft star colors
      }
    }
  }

  update(primaryColor: string) {
    this.life++;

    if (this.theme === 'forager') {
      // Sine wave horizontal movement
      this.x += Math.sin(this.life * 0.02 + this.seed) * 1.5;
    } else {
      this.x += this.vx;
    }

    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Reset if dead or offscreen
    if (this.life > this.maxLife ||
      this.x < -50 || this.x > this.canvasWidth + 50 ||
      this.y < -50 || this.y > this.canvasHeight + 50) {
      if (this.theme !== 'astral' || this.type === 'shooting_star') {
        this.reset(primaryColor, false);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    if (this.type === 'glow') {
      // Hearth Embers
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI); // Fade in and out
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);

      // Convert hex to rgb for rgba manipulation
      // Fallback if not standard hex
      gradient.addColorStop(0, `rgba(255, 200, 100, ${alpha})`);
      gradient.addColorStop(0.2, this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'leaf') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      // Simple leaf shape using bezier curves
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size, -this.size / 2, 0, this.size);
      ctx.quadraticCurveTo(-this.size, -this.size / 2, 0, -this.size);
      ctx.fill();
    }
    else if (this.type === 'rain') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillRect(this.x, this.y, 2, this.size);
    }
    else if (this.type === 'sprinkle') {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      const w = this.size * 2;
      const h = this.size;
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
      ctx.fill();
    }
    else if (this.type === 'hexagon') {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = Math.cos(angle) * this.size;
        const py = Math.sin(angle) * this.size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
    else if (this.type === 'star') {
      // Twinkle phase
      const alpha = (Math.sin(this.life * 0.05) + 1) / 2 * 0.8 + 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'white';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'shooting_star') {
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * 4, this.y - this.vy * 4); // Tail
      ctx.stroke();

      // Star head
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

const ThemeEnvironment: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Read current theme primary color dynamically from CSS variables
    const computedStyle = getComputedStyle(document.body);
    // Remove spaces, just in case
    let primaryColor = computedStyle.getPropertyValue('--theme-primary').trim();
    if (!primaryColor) primaryColor = '#ffffff';

    const resize = () => {
      // Handle high DPI displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      // Re-initialize particles when resize or theme changes
      initParticles(rect.width, rect.height);
    };

    const initParticles = (width: number, height: number) => {
      particles = [];
      let count = 0;

      if (theme === 'hearth') count = 0;
      if (theme === 'forager') count = 15;
      if (theme === 'neon') count = 20;
      if (theme === 'royal') count = 25;
      if (theme === 'chromatic') count = 30;
      if (theme === 'astral') count = 50;

      for (let i = 0; i < count; i++) {
        particles.push(new Particle(theme, width, height, primaryColor));
      }
    };

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get exact CSS background color for blending fallback if needed, 
      // but we are using transparent canvas over body bg, so just clearRect is fine.

      const rect = canvas.getBoundingClientRect();

      particles.forEach(p => {
        p.update(primaryColor);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);

    // Slight delay to ensure CSS variables are applied to body before reading
    setTimeout(() => {
      primaryColor = getComputedStyle(document.body).getPropertyValue('--theme-primary').trim() || primaryColor;
      resize();
      render();
    }, 50);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); // Re-run effect when theme changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full z-[-1]"
    />
  );
};

export default ThemeEnvironment;
