import * as THREE from 'three'
import { extend, ThreeElement } from '@react-three/fiber'

/**
 * Géométrie personnalisée pour créer un plan courbé.
 * Utilisée pour donner cet effet de "carrousel cylindrique".
 */
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius: number, ...args: [number?, number?, number?, number?]) {
    super(...args)

    const p = this.parameters
    const hw = p.width * 0.5

    const a = new THREE.Vector2(-hw, 0)
    const b = new THREE.Vector2(0, radius)
    const c = new THREE.Vector2(hw, 0)

    const ab = new THREE.Vector2().subVectors(a, b)
    const bc = new THREE.Vector2().subVectors(b, c)
    const ac = new THREE.Vector2().subVectors(a, c)

    // Calcul du rayon de courbure basé sur les 3 points
    const r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)))

    const center = new THREE.Vector2(0, radius - r)
    const baseV = new THREE.Vector2().subVectors(a, center)

    const baseAngle = baseV.angle() - Math.PI * 0.5
    const arc = baseAngle * 2

    const uv = this.attributes.uv
    const pos = this.attributes.position
    const mainV = new THREE.Vector2()

    for (let i = 0; i < uv.count; i++) {
      const uvRatio = 1 - uv.getX(i)
      const y = pos.getY(i)

      mainV.copy(c).rotateAround(center, arc * uvRatio)

      // On projette sur l'axe Z pour créer la profondeur de la courbe
      pos.setXYZ(i, mainV.x, y, -mainV.y)
    }

    pos.needsUpdate = true
  }
}

// 1. On enregistre le composant dans l'écosystème React Three Fiber
extend({ BentPlaneGeometry })

// 2. On déclare le type pour que JSX le reconnaisse sans erreur
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: ThreeElement<typeof BentPlaneGeometry> & {
        args?: [number, number, number, number, number];
      };
    }
  }
}

export { BentPlaneGeometry }