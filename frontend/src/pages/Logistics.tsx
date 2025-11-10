import { useEffect, useRef } from "react";
import ForceGraph3D from "3d-force-graph";
import { NodeObject, LinkObject } from "3d-force-graph";
import * as THREE from "three"; // ✅ needed for glow + shiny lines

interface MyNode extends NodeObject {
  id: string;
  group?: number; // 1 = driver, 2 = team
}

interface MyLink extends LinkObject<MyNode> {
  source: string;
  target: string;
}

const Logistics = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    fetch("http://localhost:5000/views/drivers-teams")
      .then((res) => res.json())
      .then((viewData) => {
        const graph = new ForceGraph3D(containerRef.current);

        const nodes: MyNode[] = [];
        const links: MyLink[] = [];

        viewData.forEach((row: any) => {
          nodes.push({ id: row.DriverName, group: 1 });

          if (!nodes.find((n) => n.id === row.TeamName)) {
            nodes.push({ id: row.TeamName, group: 2 });
          }

          links.push({
            source: row.DriverName,
            target: row.TeamName,
          });
        });

        graph.graphData({ nodes, links });
        graph.width(containerRef.current.clientWidth);
        graph.height(600);

        // ✅ Neon F1 colors
        graph.nodeColor((node: any) =>
          node.group === 1 ? "#ff073a" : "#00eaff"
        );

        // ✅ Shiny white connecting lines
        graph.linkMaterial(
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.9,
            transparent: true,
          })
        );

        // ✅ Label on hover
        graph.nodeLabel((node: any) => node.id);

        // ✅ Add F1-style lighting + glow
        const scene = graph.scene();
        const camera = graph.camera();
        const renderer = graph.renderer();

        // soft ambient light + strong point light for glow
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const pointLight = new THREE.PointLight(0xffffff, 1.5);
        pointLight.position.set(50, 50, 50);
        scene.add(ambientLight);
        scene.add(pointLight);

        // glow effect using bloom-like material
        graph.nodeThreeObject((node: any) => {
          const color = new THREE.Color(
            node.group === 1 ? "#ff073a" : "#00eaff"
          );
          const glowMaterial = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 1,
          });
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(6, 16, 16),
            glowMaterial
          );
          const glow = new THREE.Mesh(
            new THREE.SphereGeometry(9, 16, 16),
            new THREE.MeshBasicMaterial({
              color,
              transparent: true,
              opacity: 0.3,
            })
          );
          sphere.add(glow);
          return sphere;
        });

        // enable smooth rendering
        renderer.toneMappingExposure = 1.5;
        renderer.shadowMap.enabled = true;

        // cleanup
        return () => {
          try {
            graph._destructor?.();
          } catch {}
        };
      });
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-orbitron text-4xl font-bold text-foreground">
        VIEW <span className="text-gradient-racing">3D Visualization of Driver–Team Connections</span>
      </h1>
      <p className="text-muted-foreground mb-4">
        Visualization of driver-to-team relationships using SQL views + 3D graph:
        creates a virtual table (view) combining driver details and their team
        information, making it easy to query driver + team data together in one
        place.
      </p>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "600px",
          background: "black",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default Logistics;
