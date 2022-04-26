(function() {

  var canvas = this.canvas = new fabric.Canvas(null, {enableRetinaScaling: false, width: 600, height: 600});

  function makeAsWith2Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0 });

    return new fabric.ActiveSelection([rect1, rect2], {strokeWidth: 0});
  }

  function makeAsWith2ObjectsWithOpacity() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10, strokeWidth: 0, opacity: 0.5 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40, strokeWidth: 0, opacity: 0.8 });

    return new fabric.ActiveSelection([rect1, rect2], {strokeWidth: 0});
  }

  function makeAsWith4Objects() {
    var rect1 = new fabric.Rect({ top: 100, left: 100, width: 30, height: 10 }),
        rect2 = new fabric.Rect({ top: 120, left: 50, width: 10, height: 40 }),
        rect3 = new fabric.Rect({ top: 40, left: 0, width: 20, height: 40 }),
        rect4 = new fabric.Rect({ top: 75, left: 75, width: 40, height: 40 });

    return new fabric.ActiveSelection([rect1, rect2, rect3, rect4]);
  }

  QUnit.module('fabric.ActiveSelection', {
    afterEach: function() {
      canvas.clear();
      canvas.backgroundColor = fabric.Canvas.prototype.backgroundColor;
      canvas.calcOffset();
      canvas.preserveObjectStacking = false;
    }
  });

  QUnit.test('constructor', function(assert) {
    var group = makeAsWith2Objects();

    assert.ok(group);
    assert.ok(group instanceof fabric.ActiveSelection, 'should be instance of fabric.ActiveSelection');
  });

  QUnit.test('toString', function(assert) {
    var group = makeAsWith2Objects();
    assert.equal(group.toString(), '#<fabric.ActiveSelection: (2)>', 'should return proper representation');
  });

  QUnit.test('toObject', function(assert) {
    var group = makeAsWith2Objects();

    assert.ok(typeof group.toObject === 'function');

    var clone = group.toObject();

    var expectedObject = {
      version:                  fabric.version,
      type:                     'activeSelection',
      originX:                  'left',
      originY:                  'top',
      left:                     50,
      top:                      100,
      width:                    80,
      height:                   60,
      fill:                     'rgb(0,0,0)',
      layout:                   'fit-content',
      stroke:                   null,
      strokeWidth:              0,
      strokeDashArray:          null,
      strokeLineCap:            'butt',
      strokeDashOffset:         0,
      strokeLineJoin:           'miter',
      strokeMiterLimit:         4,
      scaleX:                   1,
      scaleY:                   1,
      shadow:                   null,
      subTargetCheck:           false,
      interactive:              false,
      visible:                  true,
      backgroundColor:          '',
      angle:                    0,
      flipX:                    false,
      flipY:                    false,
      opacity:                  1,
      fillRule:                 'nonzero',
      paintFirst:               'fill',
      globalCompositeOperation: 'source-over',
      skewX:                    0,
      skewY:                    0,
      strokeUniform:            false,
      objects:                  clone.objects
    };

    assert.deepEqual(clone, expectedObject);

    assert.ok(group !== clone, 'should produce different object');
    assert.ok(group.getObjects() !== clone.objects, 'should produce different object array');
    assert.ok(group.getObjects()[0] !== clone.objects[0], 'should produce different objects in array');
  });

  QUnit.test('toObject without default values', function(assert) {
    var group = makeAsWith2Objects();
    group.includeDefaultValues = false;
    var clone = group.toObject();
    var objects = [{
      version: fabric.version,
      type: 'rect',
      left: 10,
      top: -30,
      width: 30,
      height: 10,
      strokeWidth: 0
    }, {
      version: fabric.version,
      type: 'rect',
      left: -40,
      top: -10,
      width: 10,
      height: 40,
      strokeWidth: 0
    }];
    var expectedObject = {
      version:            fabric.version,
      type:               'activeSelection',
      left:               50,
      top:                100,
      width:              80,
      height:             60,
      objects:            objects,
    };
    assert.deepEqual(clone, expectedObject);
  });

  QUnit.test('_renderControls', function(assert) {
    assert.ok(typeof fabric.ActiveSelection.prototype._renderControls === 'function');
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    var group = makeAsWith2ObjectsWithOpacity();

    assert.ok(typeof fabric.ActiveSelection.fromObject === 'function');
    var groupObject = group.toObject();

    fabric.ActiveSelection.fromObject(groupObject).then(function(newGroupFromObject) {

      var objectFromOldGroup = group.toObject();
      var objectFromNewGroup = newGroupFromObject.toObject();

      assert.ok(newGroupFromObject instanceof fabric.ActiveSelection);

      assert.deepEqual(objectFromOldGroup.objects[0], objectFromNewGroup.objects[0]);
      assert.deepEqual(objectFromOldGroup.objects[1], objectFromNewGroup.objects[1]);

      // delete `objects` arrays, since `assertHashEqual` fails to compare them for equality
      delete objectFromOldGroup.objects;
      delete objectFromNewGroup.objects;

      assert.deepEqual(objectFromOldGroup, objectFromNewGroup);

      done();
    });
  });

  QUnit.test('get with locked objects', function(assert) {
    var group = makeAsWith2Objects();

    assert.equal(group.get('lockMovementX'), false);

    // TODO activeGroup
    // group.getObjects()[0].lockMovementX = true;
    // assert.equal(group.get('lockMovementX'), true);
    //
    // group.getObjects()[0].lockMovementX = false;
    // assert.equal(group.get('lockMovementX'), false);

    group.set('lockMovementX', true);
    assert.equal(group.get('lockMovementX'), true);

    // group.set('lockMovementX', false);
    // group.getObjects()[0].lockMovementY = true;
    // group.getObjects()[1].lockRotation = true;
    //
    // assert.equal(group.get('lockMovementY'), true);
    // assert.equal(group.get('lockRotation'), true);
  });

  QUnit.test('inherited methods', function (assert) {
    var methods = ['add', 'insertAt', 'remove', 'removeAll'];
    methods.forEach(method => {
      assert.strictEqual(fabric.ActiveSelection.prototype[method], fabric.Group.prototype[method]);
    });
  });

  QUnit.test('ActiveSelection shouldCache', function(assert) {
    var rect1 = new fabric.Rect({ top: 1, left: 1, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        rect2 = new fabric.Rect({ top: 5, left: 5, width: 2, height: 2, strokeWidth: 0, fill: 'red', opacity: 1, objectCaching: true}),
        group = new fabric.ActiveSelection([rect1, rect2], { objectCaching: true});

    assert.equal(group.shouldCache(), false, 'Active selection do not cache');
  });

  QUnit.test('canvas property propagation', function(assert) {
    var g2 = makeAsWith4Objects();

    canvas.add(g2);
    assert.equal(g2.canvas, canvas);
    assert.equal(g2._objects[3].canvas, canvas);
  });

  QUnit.test('moveTo on activeSelection', function(assert) {
    var group = makeAsWith4Objects({ canvas: canvas }),
        groupEl1 = group.getObjects()[0],
        groupEl2 = group.getObjects()[1],
        groupEl3 = group.getObjects()[2],
        groupEl4 = group.getObjects()[3];
    canvas.add(groupEl1, groupEl2, groupEl3, groupEl4);
    canvas.setActiveObject(group);
    assert.ok(typeof group.item(0).moveTo === 'function');

    // [ 1, 2, 3, 4 ]
    assert.equal(group.item(0), groupEl1, 'actual group position 1');
    assert.equal(group.item(1), groupEl2, 'actual group position 2');
    assert.equal(group.item(2), groupEl3, 'actual group position 3');
    assert.equal(group.item(3), groupEl4, 'actual group position 4');
    assert.equal(group.item(9999), undefined);
    assert.equal(canvas.item(0), groupEl1, 'actual canvas position 1');
    assert.equal(canvas.item(1), groupEl2, 'actual canvas position 2');
    assert.equal(canvas.item(2), groupEl3, 'actual canvas position 3');
    assert.equal(canvas.item(3), groupEl4, 'actual canvas position 4');
    assert.equal(canvas.item(9999), undefined);

    group.item(0).moveTo(3);

    assert.equal(group.item(0), groupEl1, 'did not change group position 1');
    assert.equal(group.item(1), groupEl2, 'did not change group position 2');
    assert.equal(group.item(2), groupEl3, 'did not change group position 3');
    assert.equal(group.item(3), groupEl4, 'did not change group position 4');
    assert.equal(group.item(9999), undefined);
    // moved 1 to level 3 — [2, 3, 4, 1]
    assert.equal(canvas.item(3), groupEl1, 'item 1 is not at last');
    assert.equal(canvas.item(0), groupEl2, 'item 2 shifted down to 1');
    assert.equal(canvas.item(1), groupEl3, 'item 3 shifted down to 2');
    assert.equal(canvas.item(2), groupEl4, 'item 4 shifted down to 3');
    assert.equal(canvas.item(9999), undefined);
  });

  QUnit.test('dirty flag propagation from children up', function (assert) {
    var obj = new fabric.Object();
    var g = new fabric.Group([obj]);
    var activeSelection = new fabric.ActiveSelection([obj]);
    assert.equal(activeSelection.canvas, undefined);
    assert.equal(obj.group, activeSelection);
    assert.equal(obj.__owningGroup, g);

    g.ownCaching = true;

    //  cache
    g.dirty = false;
    activeSelection.dirty = false;
    obj.dirty = false;
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');
    obj.set('fill', 'red');
    assert.equal(obj.dirty, true, 'Obj should have dirty flag set');
    assert.equal(g.dirty, true, 'Group should have dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    //  no change
    g.dirty = false;
    obj.dirty = false;
    obj.set('fill', 'red');
    assert.equal(obj.dirty, false, 'Obj should have no dirty flag set');
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    //  state
    g.dirty = false;
    obj.dirty = false;
    obj.set('angle', 5);
    assert.equal(obj.dirty, false, 'Obj should have dirty flag still false');
    assert.equal(g.dirty, true, 'Group should have dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    //  no caching
    g.ownCaching = false;
    g.dirty = false;
    obj.dirty = false;
    obj.set('fill', 'blue');
    assert.equal(obj.dirty, true, 'Obj should have dirty flag');
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    g.ownCaching = true;

    //  canvas.preserveObjectStacking
    canvas.preserveObjectStacking = false;
    g.set('canvas', canvas);
    activeSelection.set('canvas', canvas);
    g.dirty = false;
    activeSelection.dirty = false;
    obj.dirty = false;
    obj.set('fill', 'yellow');
    assert.equal(obj.dirty, true, 'Obj should have dirty flag set');
    assert.equal(g.dirty, false, 'Group should have dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    canvas.preserveObjectStacking = true;
    g.dirty = false;
    activeSelection.dirty = false;
    obj.dirty = false;
    obj.set('fill', 'green');
    assert.equal(obj.dirty, true, 'Obj should have dirty flag set');
    assert.equal(g.dirty, true, 'Group should have dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');
  });

  QUnit.test('dirty flag propagation from active selection to owning groups', function (assert) {
    var obj = new fabric.Object();
    var g = new fabric.Group([obj], { canvas: canvas });
    var activeSelection = new fabric.ActiveSelection([obj], { canvas: canvas });
    assert.equal(obj.group, activeSelection);
    assert.equal(obj.__owningGroup, g);

    g.ownCaching = true;
    canvas.preserveObjectStacking = true;

    //  not state
    g.dirty = false;
    activeSelection.dirty = false;
    obj.dirty = false;
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');
    activeSelection.set('foo', 'red');
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    //  state
    g.dirty = false;
    activeSelection.dirty = false;
    activeSelection.set('angle', 5);
    assert.equal(g.dirty, true, 'Group should have dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    //  no change
    g.dirty = false;
    activeSelection.dirty = false;
    activeSelection.set('angle', 5);
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

    //  no caching
    g.ownCaching = false;
    g.dirty = false;
    activeSelection.dirty = false;
    activeSelection.set('skewX', 45);
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have dirty flag set');

    g.ownCaching = true;

    //  canvas.preserveObjectStacking
    canvas.preserveObjectStacking = false;
    g.dirty = false;
    activeSelection.dirty = false;
    activeSelection.set('angle', 45);
    assert.equal(g.dirty, false, 'Group should have no dirty flag set');
    assert.equal(activeSelection.dirty, false, 'ActiveSelection should have no dirty flag set');

  });
})();
