Ext.define('Rally.example.SpecificColumnsBoard', {
    extend: 'Rally.app.App',
    items: [
        {
            xtype: 'container',
            itemId: 'header'
        },
        {
            xtype: 'container',
            itemId: 'main'
        }
    ],
    cardHeight: 140,
    cardWidth: 220,
    launch: function() {

        this.down('#header').add({
            xtype: 'rallyreleasecombobox',
            fieldLabel: 'Filter by Release:',
            project: this.getContext().getProject(),
            value: Rally.util.Ref.getRelativeUri(this.getContext().getTimeboxScope()),
            listeners: {
                select: this._onLoad,
                ready: this._onLoad,
                scope: this
            }
        });

        // Rally.data.ModelFactory.getModel({
        //     type: 'User Story',
        //     success: function(model) {
        //         var objectId = 214129758976;
        //         console.log('objectId', objectId);
        //         model.load(objectId, {
        //             fetch: ['FormattedID', 'Name', 'Owner', 'Estimate', 'ScheduledState', 'Project', 'Iteration'],
        //             callback: function(userStory, operation) {
        //                 if(operation.wasSuccessful()) {
        //                     console.log('model', userStory);

        //                     var card1 = this._makeUserStoryCard(userStory, 10, 260);
        //                     var card2 = this._makeUserStoryCard(userStory, 360, 360);

        //                     var line1 = this._makeLineBetweenCards(card1, card2);

        //                     var card3 = this._makeUserStoryCard(userStory, 600, 10);

        //                     var line2 = this._makeLineBetweenCards(card1, card3);
        //                     var line3 = this._makeLineBetweenCards(card2, card3);
        //                     var line4 = this._makeLineBetweenCards(card3, card1);

        //                     this.down('#main').add(card1);
        //                     this.down('#main').add(card2);
        //                     this.down('#main').add(card3);
        //                     this.down('#main').add(line1);
        //                     this.down('#main').add(line2);
        //                     this.down('#main').add(line3);
        //                     this.down('#main').add(line4);

        //                 }
        //             },
        //             scope: this
        //         });
        //     },
        //     scope: this
        // });
    },
    _makeUserStoryCard: function(userStory, left, top) {
        var iName = (userStory.get('Iteration') == null)? 'Not Scheduled' : userStory.get('Iteration').Name;
        var ownerName = (userStory.get('Owner')==null)? 'No Owner' : userStory.get('Owner')._refObjectName;
        var html = '<div style="border: 1px solid black; margin-bottom: 5px; height: ' + this.cardHeight +'px; overflow: auto">' +
        '<div>' +
        '<div style="padding-left: 3px; padding-right: 3px; overflow: auto; background: LightBlue">' +
        '<div style="float: left"><a style="color: black; text-decoration: underline" href="' + Rally.nav.Manager.getDetailUrl(userStory) + '">' + userStory.get('FormattedID') + '</a>&nbsp;&nbsp;&nbsp;' + userStory.get('PlanEstimate') + ' Points</div><div style="float: right">' + userStory.get('ScheduleState') + '</div>' +
        '</div>' +
        '<div style="padding-left: 10px; padding-right: 10px;">' +
        '<p>' + userStory.get('Name') + '</p>' +
        '<div>' + ownerName + '</div>' +
        '<div>' + iName + '</div>' + 
        '<div>' + userStory.get('Project').Name + '</div>' +
        '</div></div></div>';

        return Ext.create('Ext.Component', {
            html: html,
            width: this.cardWidth,
            style: {
                left: left + 'px',
                top: top + 'px',
                position: 'absolute'
            },
            renderTo: Ext.getBody()
        });
    },
    _makeFeatureCard: function(feature, left, top) {
        var featureEst = (feature.get('PreliminaryEstimate') == null)? 'None' : feature.get('PreliminaryEstimate').Name;
        var featureState = (feature.get('State') == null)? 'None' : feature.get('State').Name;
        var featureOwner = (feature.get('Owner') == null)? 'None' : feature.get('Owner')._refObjectName;
        var html = 
        '<div style="border: 1px solid black;">' +
            '<div>' +
                '<div style="padding-left: 3px; padding-right: 3px; overflow: auto; background: GoldenRod">' +
                    '<div style="float: left">' + feature.get('FormattedID') + '&nbsp;&nbsp;&nbsp;Est:' + featureEst + '</div>' + 
                    '<div style="float: right">' + featureState + '</div>' +
                '</div>' +
                '<div style="padding-left: 10px; padding-right: 10px;">' +
                    '<p>' + feature.get('Name') + '</p>' +
                    '<div>' + featureOwner + '</div>' +
                    '</div>' +
                '</div>' + 
            '</div>' + 
        '</div>';

        return Ext.create('Ext.Component', {
            html: html,
            width: this.cardWidth,
            style: {
                left: left + 'px',
                top: top + 'px',
                position: 'absolute'
            },
            renderTo: Ext.getBody()
        });
    },
    _makeLineBetweenCards: function(card1, card2) {
        var left = card1.style.left;
        var top = card1.style.top;
        var x1 = Number(left.substring(0, left.length - 2)) + this.cardWidth;
        var y1 = Number(top.substring(0, top.length - 2)) + 50;
        left = card2.style.left;
        top = card2.style.top;
        var x2 = Number(left.substring(0, left.length - 2));
        var y2 = Number(top.substring(0, top.length - 2)) + 50;

        var deltaX = Math.abs(x2-x1);
        var deltaY = Math.abs(y2-y1);

        var startX = 0;
        var endX = deltaX;
        var startY, endY;

        if(x2 > x1) {
            left = x1;
            if(y2 > y1) {
                top = y1;
                startY = 0;
                endY = deltaY;
            }
            else {
                top = y2;
                startY = deltaY;
                endY = -1 * deltaY; //0;
            }
        }
        else {
            left = x2;
            if(y2 > y1) {
                top = y1;
                startY = deltaY;
                endY = -1 * deltaY; //0;
            }
            else {
                top = y2;
                startY = 0;
                endY = deltaY;
            }
        }

        console.log('top', top);
        console.log('left', left);
        console.log('deltaX', deltaX);
        console.log('deltaY', deltaY);
        console.log('startX', startX);
        console.log('startY', startY);
        console.log('endX', endX);
        console.log('endY', endY);

        var html = '<svg width="' + deltaX + '" height="' + deltaY + '">' +
        '<g fill="none" stroke="black" stroke-width="1">' +
         '<path stroke-dasharray="5,5" d="M' + startX + ' ' + startY + ' l' + endX + ' ' + endY + '" />' +
        '</g>' +
        'Sorry, your browser does not support inline SVG.' +
        '</svg>';

        return Ext.create('Ext.Component', {
            html: html,
            style: {
                left: left +'px',
                top: top + 'px',
                position: 'absolute'
            },
            renderTo: Ext.getBody()
        });
    },
    _onLoad: function() {
        Ext.create('Rally.data.wsapi.Store', {
            model: 'PortfolioItem/Feature',
            autoLoad: true,
            filters: [
                {
                    property: 'Release',
                    operator: '=',
                    value: this.down('rallyreleasecombobox').getValue()
                }
            ],
            listeners: {
                load: this._onFeaturesLoaded,
                scope: this
            },
			sorters: [{
				property: 'Rank'
			}]
        });
    },

    _onSelect: function() {
        // var board = this.down('rallycardboard');
        // board.refresh({
        //     // storeConfig: {
        //     //     filters: [this._getReleaseFilter()]
        //     // }
        // });
    },

    // _getReleaseFilter: function() {
    //     var releaseCombo = this.down('rallyreleasecombobox');
    //     return {
    //         property: 'Feature.Release',
    //         operator: '=',
    //         value: releaseCombo.getValue()
    //     };
    // },
    features: [],
    gIterations: [],
    _onFeaturesLoaded: function(store, features) {
        var _this = this;
        var featureStoreCount = store.count();
        var featureCount = 0;
        
        this.gIterations.push({
            name: 'Not Scheduled',
            startDate: new Date(0)
        }); 

        // loop through all features
        _.each(features, function(feature) {
            // add to feature list
            var thisFeature = {
                featureModel: feature,
                iterations: []
            };
            thisFeature.iterations.push({
                name: 'Not Scheduled',
                userStories: []
            });
            _this.features.push(thisFeature);

            var stories = feature.getCollection('UserStories');

            stories.load({
                fetch: ['FormattedID', 'Name', 'Owner', 'PlanEstimate', 'ScheduleState', 'Project', 'Iteration', 'StartDate', 'Successors', 'Predecessors', 'Defects'],
                callback: function(records, operation, success){
                    var usStoreCount = records.length;
                    var usCount = 0;
                    featureCount++;
                    // look through all user stories
                    

                    Ext.Array.each(records, function(story){
                        usCount++;

                        // 
                        var iteration = story.get('Iteration');
                        if(iteration == null) {
                            thisFeature.iterations[0].userStories.push(story);
                            console.log('unscheduled', story);
                        }
                        else {
                            var isNewIteration = false;
                            var inGIterations = false;
                            for(var i = 0; i< _this.gIterations.length;i++) {
                                if(_this.gIterations[i].name == iteration._refObjectName) {
                                    inGIterations = true;
                                    break;
                                }
                            }
                            if(!inGIterations){
                                _this.gIterations.push({
                                    name: iteration._refObjectName,
                                    startDate: iteration.StartDate
                                });
                                isNewIteration = true;

                                console.log('new global iteration', iteration);
                                }

                            var found = false;
                            var iterationIndex = 0;
                            if(!isNewIteration) {
                                for(;iterationIndex<thisFeature.iterations.length; iterationIndex++) {
                                    if(thisFeature.iterations[iterationIndex].name == iteration._refObjectName) {
                                        found = true;
                                        break;
                                    }
                                }
                            }

                            if(isNewIteration || (!found)) {
                                isNewIteration = true;
                            }

                            if(!isNewIteration) {
                                thisFeature.iterations[iterationIndex].userStories.push(story);
                            }
                            else {
                                var newIteration = {
                                    name: iteration._refObjectName,
                                    userStories: []
                                };
                                newIteration.userStories.push(story);
                                thisFeature.iterations.push(newIteration);
                                //console.log('new feature iteration', iteration);
                            }
                        }

                        // chain these last operations as promises
                        // process predecessors
                        // process successors
                        // process defects

                        // if this was the last feature and last user story, start rendering
                    
                        if(featureCount == 1) { console.log('feature 1', _this.features[1]); }

                        if(usCount == usStoreCount && featureCount == featureStoreCount) {
                            // all iterations are known, sort them by startDate
                            _this.gIterations.sort(function(a, b){
                                return a.startDate > b.startDate;
                            });
                            console.log('featureCount', featureCount);
                            
                            _this._renderFeatures();
                        }

                    }); // end of .each statement for stories


                }, // end of stories.load call back
                scope: this
            });
        }); // end of .each statement for features
    },
    _loadChildren: function(stories) {
        var promises = [];
        _.each(stories, function(story) {
            var defects = story.get('Defects');
            if(defects.Count > 0) {
                defects.store = story.getCollection('Defects');
                promises.push(defects.store.load());
            }
            var predecessors = story.get('Predecessors');
            if(predecessors.Count > 0) {
                predecessors.store = story.getCollection('Predecessors');
                promises.push(predecessors.store.load());
            }
            var successors = story.get('Successors');
            if(successors.Count > 0) {
                successors.store = story.getCollection('Successors');
                promises.push(successors.store.load());
            }
        });
        return Deft.Promise.all(promises);
    },
    _getDefects: function(userStory) {
        var defects = userStory.getCollection('Defects');
        return defects.load({
            fetch: ['FormattedID'],//, 'Name', 'Owner', 'PlanEstimate', 'ScheduleState', 'Project', 'Iteration', 'StartDate', 'Successors', 'Predecessors'],
        });
    },
    _getPredecessors: function(userStory) {
        var predecessors = userStory.getCollection('Predecessors');
        predecessors.load({
            fetch: ['FormattedID'],//, 'Name', 'Owner', 'PlanEstimate', 'ScheduleState', 'Project', 'Iteration', 'StartDate', 'Successors', 'Predecessors'],
            callback: function(records, operation, success){
                userStory.predecessors = records;
            }
        });
        return userStory;
    },
    _getSuccessors: function(userStory) {
        var successors = userStory.getCollection('Successors');
        successors.load({
            fetch: ['FormattedID'],//, 'Name', 'Owner', 'PlanEstimate', 'ScheduleState', 'Project', 'Iteration', 'StartDate', 'Successors', 'Predecessors'],
            callback: function(records, operation, success){
                userStory.successors = records;
            }
        });
        return userStory;
    },
    predecessorCards: [],
    successorCards: [],
    _renderFeatures: function() {
        console.log('render time');

        // add iterations header
        var html = '<div><div style="position: absolute; left: 0px; top: 0px;">Iterations</div>';
        for(var i=0; i<this.gIterations.length;i++) {
            html+= '<div style="width: ' + this.cardWidth + 'px; position: absolute; left: ' + (this.cardWidth * (i+1)) + 'px; top: 0px">' + this.gIterations[i].name + '</div>';
        }
        html+= '</div>';

        var iterationsHeader = Ext.create('Ext.Component', {
            html: html,
            style: {
                left: '20px',
                top: '60px',
                position: 'absolute'
            },
            renderTo: Ext.getBody()
        });

        this.down('#main').add(iterationsHeader);

        console.log('about to load cards');
        // start adding features and user stories to board
        var featureTop = 200;
        var fLen = this.features.length;
        for(var n=0;n<fLen;n++) {
            var feature = this.features[n];
            //console.log('feature', feature);
            this.down('#main').add(this._makeFeatureCard(feature.featureModel, 0, featureTop));
            var storyTopMax = featureTop;
            var iLen = feature.iterations.length;
            for(var j=0;j<iLen;j++) {
                var iteration = feature.iterations[j];
                var storyTop = featureTop;
                //console.log('iteration', iteration.name);
                var usLen = iteration.userStories.length;
                for(var k=0;k<usLen;k++) {
                    var userStory = iteration.userStories[k];
                    for(var l=0;l<this.gIterations.length;l++) {
                        //console.log('user story', userStory);
                        var iName = (userStory.get('Iteration') == null)? 'Not Scheduled': userStory.get('Iteration').Name;
                        //console.log('iName', iName);
                        if(iName == this.gIterations[l].name) {
                            var newUSCard = this._makeUserStoryCard(userStory, this.cardWidth * (l+1), storyTop);
                            
                            // if this user story has successors, it is a predecessor
                            var successorCount = userStory.get('Successors').Count;
                            if(successorCount > 0 ) {
                                this._addToPredecessors(newUSCard, userStory);
                                //var _this = this;
                            }

                            // if this user story has predecessors, it is a successor
                            var predecessorCount = userStory.get('Predecessors').Count;
                            if(predecessorCount > 0) {
                                this._addToSuccessors(newUSCard, userStory);
                            }

                            this.down('#main').add(newUSCard);
                            storyTop += this.cardHeight;
                            break;
                        }
                    }
                }
                if(storyTop > storyTopMax) {
                    storyTopMax = storyTop;
                }
            }
            featureTop = storyTopMax + this.cardHeight;
        }
        //console.log(this.predecessorCards);
        //console.log(this.successorCards);
        // var predecessorCardCount = this.predecessorCards.length;
        // for(var i=0; i<predecessorCardCount; i++) {

        // }
    },
    _addToPredecessors: function(card, userStory) {
        var successors = userStory.getCollection('Successors');
        var _this = this;
        successors.load({
            fetch: ['FormattedID'],//, 'Name', 'Owner', 'PlanEstimate', 'ScheduleState', 'Project', 'Iteration', 'StartDate', 'Successors', 'Predecessors'],
            callback: function(records, operation, success){
                Ext.Array.each(records, function(story){
                    _this.predecessorCards.push({
                        card: card,
                        storyId: userStory.get('FormattedID'),
                        successorId: story.get('FormattedID')
                    });
                });
            }
        });
    },
    _addToSuccessors: function(card, userStory) {
        var predecessors = userStory.getCollection('Predecessors');
        var _this = this;
        predecessors.load({
            fetch: ['FormattedID'],//, 'Name', 'Owner', 'PlanEstimate', 'ScheduleState', 'Project', 'Iteration', 'StartDate', 'Successors', 'Predecessors'],
            callback: function(records, operation, success){
                Ext.Array.each(records, function(story){
                    _this.successorCards.push({
                        card: card,
                        storyId: userStory.get('FormattedID'),
                        predecessorId: story.get('FormattedID')
                    });
                });
            }
        });
    },
});

//F70027
Rally.launchApp('Rally.example.SpecificColumnsBoard', {
  name: 'Specific Columns Board Example'
});