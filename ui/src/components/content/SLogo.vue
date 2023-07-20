<template>
  <div class="s-logo">
    <span class="s-l-circle bg-white flex col justify-c align-c">÷</span>
    <span class="s-l-circle bg-chartreuse flex col justify-c align-c">+</span>
    <span class="s-l-circle bg-olive flex col justify-c align-c">−</span>
    <span class="s-l-circle bg-white flex col justify-c align-c">×</span>
  </div>
</template>

<style lang="scss">
.s-logo {
  --logo-size: 100px;
  width: var(--logo-size);
  height: var(--logo-size);
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 50%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-black);
  }
  .s-l-circle {
    position: absolute;
    box-sizing: border-box;
    border: calc(var(--logo-size) * 0.05) solid var(--color-black);
    border-radius: 50%;
    font-size: calc(var(--logo-size) * 0.4);
    font-weight: bold;
    box-sizing: border-box;
    font-family: 'Dosis' $font-sans;
    &:nth-child(1) {
      top: 0;
      left: 0;
      right: 48.5%;
      bottom: 48.5%;
    }
    &:nth-child(2) {
      top: 0;
      left: 48.5%;
      right: 0;
      bottom: 48.5%;
    }
    &:nth-child(3) {
      top: 48.5%;
      left: 0;
      right: 48.5%;
      bottom: 0;
    }
    &:nth-child(4) {
      top: 48.5%;
      left: 48.5%;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
