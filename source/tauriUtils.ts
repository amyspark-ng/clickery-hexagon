export function runOnTauri(func: () => void): void {
  if ("__TAURI__" in window) {
    func();
  }
}