<template>
  <div class="confetti">
    <div class="confetti-piece" v-for="i in 20" :key="i"></div>
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
$yellow: #d1ac3a;
$blue: #d1ac3a;
$pink: #d1ac3a;

$height: 500;
$duration: $height * 5;
@function randomNum($min, $max) {
  $rand: random();
  $randomNum: $min + floor($rand * (($max - $min) + 1));

  @return $randomNum;
}

.confetti {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  min-height: #{$height}px;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 16px;
  background: $yellow;
  top: 0;
  opacity: 0;

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      left: $i * 7%;
      transform: rotate(#{randomNum(-80, 80)}deg);
      animation: makeItRain $duration * 1ms infinite ease-out;
      animation-delay: #{randomNum(0, $duration * 0.5)}ms;
      animation-duration: #{randomNum($duration * 0.7, $duration * 1.2)}ms;
    }
  }

  &:nth-child(odd) {
    background: $blue;
  }

  &:nth-child(even) {
    z-index: 1;
  }

  &:nth-child(4n) {
    width: 5px;
    height: 12px;
    animation-duration: $duration * 2ms;
  }

  &:nth-child(3n) {
    width: 3px;
    height: 10px;
    animation-duration: $duration * 2.5ms;
    animation-delay: $duration * 1ms;
  }

  &:nth-child(4n-7) {
    background: $pink;
  }
}

@keyframes makeItRain {
  from {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  to {
    transform: translateY(#{$height}px);
  }
}
</style>
