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
	    posRKfJSON.times[idx] = idx * 0.001;
	    posRKfJSON.values[idx*3  ] = String(1.5-parseFloat(toks[1])*1.0);
	    posRKfJSON.values[idx*3+1] = String(parseFloat(toks[2])*1.0+0.1);
	    posRKfJSON.values[idx*3+2] = String(-parseFloat(toks[0])*1.0);
	    rxRKfJSON.times[idx]  = idx * 0.001;
	    ryRKfJSON.times[idx]  = idx * 0.001;
	    rzRKfJSON.times[idx]  = idx * 0.001;
	    rxRKfJSON.values[idx] = String(-parseFloat(toks[4]) );
	    ryRKfJSON.values[idx] = String(parseFloat(toks[5])  );
	    rzRKfJSON.values[idx] = String(-parseFloat(toks[3]) );
	    //rxRKfJSON.values[idx] = String(-parseFloat(toks[4])*0.25);
	    //ryRKfJSON.values[idx] = String(parseFloat(toks[5])*0.25);
	    //rzRKfJSON.values[idx] = String(-parseFloat(toks[3])*0.25);
	    //ryRKfJSON.values[idx] = "0.0";//String(parseFloat(toks[5])*0.25);
	    //rzRKfJSON.values[idx] = "0.0";//String(parseFloat(-toks[3])*0.25);
	    ++idx;
	}
	clipRJSON.duration = parseFloat(posRKfJSON.times[idx-1]);
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
            posLKfJSON.times[idx] = idx * 0.001;
            posLKfJSON.values[idx*3  ] = String(-parseFloat(toks[1])*1.0);
            posLKfJSON.values[idx*3+1] = String(parseFloat(toks[2])*1.0+0.1);
            posLKfJSON.values[idx*3+2] = String(-parseFloat(toks[0])*1.0);
            rxLKfJSON.times[idx]  = idx * 0.001;
            ryLKfJSON.times[idx]  = idx * 0.001;
            rzLKfJSON.times[idx]  = idx * 0.001;
            rxLKfJSON.values[idx] = String(-parseFloat(toks[4]));
            ryLKfJSON.values[idx] = String(parseFloat(toks[5]));
            rzLKfJSON.values[idx] = String(-parseFloat(toks[3]));
	    ++idx;
	}
	clipLJSON.duration = parseFloat(posLKfJSON.times[idx-1]);
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

