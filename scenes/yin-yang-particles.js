
class YinYangParticlesAnimation {
    constructor() {
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.stats = null;
        this.sphere = null;
        this.noise = [];
        this.container = document.getElementById('bgcontainer');
        this.WIDTH = this.container.clientWidth;
        this.HEIGHT = this.container.clientHeight;
        this.amount = 100000;
        this.radius = 200;
        this.radiusBig = null;
        this.radiusSmall = null;
        this.radiusBig2 = null;
        this.radiusSmall2 = null;
        this.settings = {
            static: false,
            angle: 0,
            clockwise: true,
            speed: 0.01
        };
        this.animationId = null;
    }

    isInCircle(x, y) {
        return Math.pow(x, 2) + Math.pow(y, 2) <= this.radiusBig2;
    }

    updateSettings(options) {
        if (options) {
            if (options.static !== undefined)
                this.settings.static = options.static;
            if (options.angle !== undefined)
                this.settings.angle = options.angle;
            if (options.clockwise !== undefined)
                this.settings.clockwise = options.clockwise;
        }
    }

    init(options) {
        if (!Detector.webgl) Detector.addGetWebGLMessage();
        
        this.updateSettings(options);

        if (this.WIDTH > this.HEIGHT)
            this.radiusBig = this.HEIGHT / 2;
        else
            this.radiusBig = this.WIDTH / 2;

        // test
        //var countInside = 0, countOutside = 0;

        this.camera = new THREE.PerspectiveCamera(40, this.WIDTH / this.HEIGHT, 1, 10000);
        this.camera.position.z = 600;

        //var tmp = new THREE.Vector3(this.radiusBig, 0, 0);
        ////console.log(tmp);
        //var world = tmp.unproject(this.camera);
        ////console.log(world);

        //this.radiusBig = world.x;
        this.radiusBig = this.radius;
        this.radiusSmall = this.radiusBig / 2;
        this.radiusBig2 = Math.pow(this.radiusBig, 2);
        this.radiusSmall2 = Math.pow(this.radiusSmall, 2);

        this.scene = new THREE.Scene();
        var positions = new Float32Array(this.amount * 3);
        var colors = new Float32Array(this.amount * 3);
        var sizes = new Float32Array(this.amount);
        var vertex = new THREE.Vector3();
        var color = new THREE.Color(0xffffff);
        for (var i = 0; i < this.amount; i++) {
            vertex.x = (Math.random() * 2 - 1) * this.radius;
            vertex.y = (Math.random() * 2 - 1) * this.radius;
            vertex.z = (Math.random() * 2 - 1) * this.radius;

            //vertex.x = random(-this.radiusBig, this.radiusBig);
            //vertex.y = random(-this.radiusBig, this.radiusBig);
            //vertex.z = random(-this.radiusBig, this.radiusBig);

            vertex.toArray(positions, i * 3);
            
            var x = vertex.x;
            var y = vertex.y;

            var x2 = Math.pow(x, 2);
            var y2 = Math.pow(y, 2);
            //inCircle = sphMain.containsPoint(vertex);

            if (x2 + y2 <= this.radiusBig2) { // 在大圆内才属于八卦的一部分
                //countInside++;
                var yang = false;
                if (x > 0 && y > 0) { // 一象限: yang
                    yang = true;
                }
                else if (x < 0 && y < 0) { // 三象限: yin
                }
                else if (x < 0 && y > 0) { // 二象限
                    if (x2 + Math.pow(y - this.radiusSmall, 2) < this.radiusSmall2) { // yang
                        yang = true;
                    }
                    //else { // yin
                    //}
                }
                else { // 四象限
                    if (x2 + Math.pow(y + this.radiusSmall, 2) < this.radiusSmall2) { // yin
                    }
                    else { // yang
                        yang = true;
                    }
                }

                if (yang) {
                    color.setHSL(0.5 + 0.1 * (i / this.amount), 0.7, 0.5);
                } else {
                    color.setHSL(0.0 + 0.1 * (i / this.amount), 0.9, 0.5);
                }
            }
            else { // 八卦圆外
                //countOutside++;
                color.setHSL(0.13, 0.13, 0.13);
            }
            
            color.toArray(colors, i * 3);
            sizes[i] = 10;
        }
        //console.log("In: " + countInside + "Out: " + countOutside);

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
        //
        var material = new THREE.ShaderMaterial({
            uniforms: {
                amplitude: { value: 1.0 },
                color: { value: new THREE.Color(0xffffff) },
                texture: { value: new THREE.TextureLoader().load("/assets/textures/sprites/spark1.png") }
            },
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        //
        this.sphere = new THREE.Points(geometry, material);
        this.scene.add(this.sphere);
        //
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        //const container = document.getElementById('bgcontainer');
        this.container.innerHTML = ''; // clear first
        this.container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        //this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        //this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    render() {
        var time = Date.now() * 0.005;
        if (this.settings.static) { // static
            this.sphere.rotation.z = this.settings.angle;
        }
        else { // spining
            let z = this.settings.speed * time;
            if (this.settings.clockwise) // clockwise
                this.sphere.rotation.z = z;
            else // anticlockwise
                this.sphere.rotation.z = -1 * z;
        }

        var geometry = this.sphere.geometry;
        var attributes = geometry.attributes;
        for (var i = 0; i < attributes.size.array.length; i++) {
            attributes.size.array[i] = 14 + 13 * Math.sin(0.1 * i + time);
        }
        attributes.size.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    run() {
        this.animationId = requestAnimationFrame(() => this.run());
        this.render();
    }

    reset() {
        this.init({});
        this.run();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        // 停止动画
        this.stop();
        
        // 清理Three.js资源
        if (this.sphere) {
            this.scene.remove(this.sphere);
            this.sphere.geometry.dispose();
            this.sphere.material.dispose();
            this.sphere = null;
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        // 清理引用
        this.scene = null;
        this.camera = null;
        this.stats = null;
        this.noise = [];
        
        // 重置状态变量
        this.WIDTH = this.container.clientWidth;
        this.HEIGHT = this.container.clientHeight;
        this.radiusBig = null;
        this.radiusSmall = null;
        this.radiusBig2 = null;
        this.radiusSmall2 = null;
        this.settings = {
            static: false,
            angle: 0,
            clockwise: true,
            speed: 0.01
        };
    }
}

// 创建全局实例
var yinYangParticlesAnimation = new YinYangParticlesAnimation();

function runYinyang() {
    return yinYangParticlesAnimation.run();
}

function stopYinyang() {
    //matrixFlowAnimation.stop();
    // 如果需要完全释放内存，可以取消注释以下行：
    yinYangParticlesAnimation.destroy();
    yinYangParticlesAnimation = new YinYangParticlesAnimation();
}

function resetYinyang() {
    return yinYangParticlesAnimation.reset();
}

window.installScene_Yinyang = function() {
    console.log("installScene_Yinyang called");
    window.runScene = runYinyang;
    window.stopScene = stopYinyang;
    window.resetScene = resetYinyang;
}