var container;

var camera, scene, renderer;
var controls;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// For right foot
var posRKfJSON = {
    name: ".position",
    type: "vector",
    times: [],
    values: []
}
var rxRKfJSON = {
    name: ".rotation[x]",
    type: "number",
    times: [],
    values: [],
    interpolation: THREE.InterpolateSmooth
}
var ryRKfJSON = {
    name: ".rotation[y]",
    type: "number",
    times: [],
    values: [],
    interpolation: THREE.InterpolateSmooth
}
var rzRKfJSON = {
    name: ".rotation[z]",
    type: "number",
    times: [],
    values: [],
    interpolation: THREE.InterpolateSmooth
}
var clipRJSON = {
    duration: 10,
    tracks: [
        posRKfJSON,
        rxRKfJSON,
        ryRKfJSON,
        rzRKfJSON
    ]
}
// For left foot
var posLKfJSON = {
    name: ".position",
    type: "vector",
    times: [],
    values: []
}
var rxLKfJSON = {
    name: ".rotation[x]",
    type: "number",
    times: [],
    values: [],
    interpolation: THREE.InterpolateSmooth
}
var ryLKfJSON = {
    name: ".rotation[y]",
    type: "number",
    times: [],
    values: [],
    interpolation: THREE.InterpolateSmooth
}
var rzLKfJSON = {
    name: ".rotation[z]",
    type: "number",
    times: [],
    values: [],
    interpolation: THREE.InterpolateSmooth
}
var clipLJSON = {
    duration: 10,
    tracks: [
        posLKfJSON,
        rxLKfJSON,
        ryLKfJSON,
        rzLKfJSON
    ]
}

var clipR, mixerR = null;
var clipL, mixerL = null;

// memo@shigeho At Foot Model, 1 indicates 10 cm
var loaderR = new THREE.FileLoader();
loaderR = loaderR.load(
    'right.csv',
    function(data) {
	var tmp = data.split("\n");
	var idx = 0;
	for (var i=0; i<tmp.length; ++i) {
	    var toks = tmp[i].split(',');
	    if (toks.length < 6) continue;
	    posRKfJSON.times[idx] = idx*0.005;
	    posRKfJSON.values[idx*3  ] = toks[0] | 0 + 1.5;
	    posRKfJSON.values[idx*3+1] = toks[2];
	    posRKfJSON.values[idx*3+2] = toks[1];
	    // posRKfJSON.values[idx*3+2] = toks[1] | 0 * (-1);
	    // posRKfJSON.values[idx*3  ] = 1.5;
	    // posRKfJSON.values[idx*3+1] = 0;
	    // posRKfJSON.values[idx*3+2] = 0;
	    rxRKfJSON.times[idx]  = idx*0.005;
	    ryRKfJSON.times[idx]  = idx*0.005;
	    rzRKfJSON.times[idx]  = idx*0.005;
	    // rxRKfJSON.values[idx] = toks[4];
	    // rxRKfJSON.values[idx] = toks[3] | 0 * (0);
	    // ryRKfJSON.values[idx] = toks[4] | 0 * (0);
	    // rzRKfJSON.values[idx] = toks[5] | 0 * (0);
	    rxRKfJSON.values[idx] = 0;
	    ryRKfJSON.values[idx] = 0;
	    rzRKfJSON.values[idx] = 0;
	    ++idx;
	}
	clipRJSON.duration = posRKfJSON.times[idx-1] | 0;
	clipR = THREE.AnimationClip.parse(clipRJSON);
    },
    function(xhr) {},
    function(err) {console.error( err );}
);

var loaderL = new THREE.FileLoader();
loaderL = loaderL.load(
    'left.csv',
    function(data) {
	var tmp = data.split("\n");
	var idx = 0;
	for (var i=0; i<tmp.length; ++i) {
	    var toks = tmp[i].split(',');
	    if (toks.length < 6) continue;
	    posLKfJSON.times[idx] = idx;
	    posLKfJSON.values[idx*3  ] = toks[0];
	    posLKfJSON.values[idx*3+1] = toks[1];
	    posLKfJSON.values[idx*3+2] = toks[2];
	    // posLKfJSON.values[idx*3  ] = 1.5;
	    // posLKfJSON.values[idx*3+1] = 0;
	    // posLKfJSON.values[idx*3+2] = 0;
	    rxLKfJSON.times[idx]  = idx;
	    ryLKfJSON.times[idx]  = idx;
	    rzLKfJSON.times[idx]  = idx;
	    // rxLKfJSON.values[idx] = toks[4];
	    rxLKfJSON.values[idx] = toks[3];
	    ryLKfJSON.values[idx] = toks[4];
	    rzLKfJSON.values[idx] = toks[5];
	    ++idx;
	}
	clipLJSON.duration = posLKfJSON.times[idx-1] | 0;
	clipL = THREE.AnimationClip.parse(clipLJSON);
    },
    function(xhr) {},
    function(err) {console.error( err );}
);

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 25;
    controls = new THREE.TrackballControls(camera);

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );


    var loader = new THREE.STLLoader( );

    loader.load( 'models/R_foot.stl', function ( geometry ) {

	var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 100 } );
        var mesh = new THREE.Mesh( geometry, material );

	scene.add( mesh );

	mixerR = new THREE.AnimationMixer(mesh);
	var action = mixerR.clipAction(clipR);
	action.play();
    } );

    loader.load( 'models/L_foot.stl', function ( geometry ) {

	var material = new THREE.MeshPhongMaterial( { color: 0x3355ff, specular: 0x111111, shininess: 100 } );
        var mesh = new THREE.Mesh( geometry, material );

	scene.add( mesh );

	mixerL = new THREE.AnimationMixer(mesh);
	var actionL = mixerL.clipAction(clipL);
	actionL.play();
    } );

    loader.load( 'models/floor.stl', function ( geometry ) {

	var material = new THREE.MeshPhongMaterial( { color: 0xff7733, specular: 0x111111, shininess: 10 } );
        var mesh = new THREE.Mesh( geometry, material );

	scene.add( mesh );
	// action.play();

    } );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    if ( mixerR ) mixerR.update(0.01);
    if ( mixerL ) mixerL.update(0.01);
    
    render();

}

function render() {

    controls.update();
    renderer.render( scene, camera );

}

