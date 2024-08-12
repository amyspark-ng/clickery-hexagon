/**
 * This function is used to run a function that will only run if you're on Tauri (desktop)
 */
export function runOnTauri(func: () => void): void {
  if ("__TAURI__" in window) {
    func();
  }
}