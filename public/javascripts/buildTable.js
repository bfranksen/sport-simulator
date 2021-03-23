jQuery(function () {   
    const currentSport = `#{sport}`;
    const path = `/${currentSport}/`;
    const data = !{leagues};
    const monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
    ]
    if (window.innerWidth > 992) {
        $('#league-table').DataTable({
            dom: '<f<t>p>',
            data: data,
            columns: [
                { 
                    data: null, 
                    orderable: false, 
                    searchable: false, 
                    className: "t-league-play",
                    render: function (data, type, row) { return '<a class="btn btn-md btn-success play-btn" href="' + path + row._id + '">Play</a>' } 
                },
                { data: "name", title: "League", className: "t-league-main" },
                { data: "team", title: "Team", className: "t-league-main", defaultContent: "", render: function(data, type, row) { return `${row.team.teamName}` } },
                { data: "stage", title: "Stage", className: "t-league-main", defaultContent: "", render: function(data, type, row) { return `${row.stage.currentYear} ${row.stage.pointOfSeason}`} },
                { data: "numSeasons", title: "# Seasons", className: "t-league-toggle", defaultContent: "",
                    render: function(data, type, row) {
                        return row.stage.currentYear - row.startingYear + 1;
                    }
                },
                { data: "createdAt", title: "Created", className: "t-league-toggle", defaultContent: "", 
                    render: function(data, type, row) {
                        const date = new Date(row.createdAt);
                        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                    } 
                },
                { data: "updatedAt", title: "Last Played", className: "t-league-toggle", defaultContent: "",
                    render: function(data, type, row) {
                        const lastUpdated = new Date(row.updatedAt);
                        const currentTime = new Date(Date.now());

                        const yearDiff = currentTime.getFullYear() - lastUpdated.getFullYear();
                        if (yearDiff > 0) {
                            return yearDiff === 1 ? `${yearDiff} year ago` : `${yearDiff} years ago`;
                        }
                        const monthDiff = currentTime.getMonth() - lastUpdated.getMonth();
                        if (monthDiff > 0) {
                            return monthDiff === 1 ? `${monthDiff} month ago` : `${monthDiff} months ago`;
                        }
                        const dayDiff = currentTime.getDate() - lastUpdated.getDate();
                        if (dayDiff > 0) {
                            return dayDiff === 1 ? `${dayDiff} day ago` : `${dayDiff} days ago`;
                        }
                        const hourDiff = currentTime.getHours() - lastUpdated.getHours();
                        if (hourDiff < 0) {
                            hourDiff = 24 + hourDiff;
                        }
                        if (hourDiff > 0) {
                            return hourDiff === 1 ? `${hourDiff} hour ago` : `${hourDiff} hours ago`;
                        }
                        const minuteDiff = currentTime.getMinutes() - lastUpdated.getMinutes();
                        return minuteDiff === 1 ? `${minuteDiff} minute ago` : `${minuteDiff} minutes ago`;
                        //- return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                    }
                }
            ],
            order: [[1, 'asc']],
            pageLength: 5,
        });
    } else if (window.innerWidth > 768) {       
        $('#league-table').DataTable({
            dom: '<f<t>p>',
            data: data,
            columns: [
                { 
                    data: null, 
                    orderable: false, 
                    searchable: false, 
                    render: function (data, type, row) { return '<a class="btn btn-md btn-success play-btn" href="' + path + row._id + '">Play</a>' } 
                },
                { data: "name", title: "League", className: "t-league-main" },
                { data: "team", title: "Team", className: "t-league-main", defaultContent: "", render: function(data, type, row) { return `${row.team.teamName}` } },
                { data: "stage", title: "Stage", className: "t-league-main", defaultContent: "", render: function(data, type, row) { return `${row.stage.currentYear} ${row.stage.pointOfSeason}`} },
                { data: "updatedAt", title: "Last Played", className: "t-league-toggle", defaultContent: "",
                    render: function(data, type, row) {
                        const lastUpdated = new Date(row.updatedAt);
                        const currentTime = new Date(Date.now());

                        const yearDiff = currentTime.getFullYear() - lastUpdated.getFullYear();
                        if (yearDiff > 0) {
                            return yearDiff === 1 ? `${yearDiff} year ago` : `${yearDiff} years ago`;
                        }
                        const monthDiff = currentTime.getMonth() - lastUpdated.getMonth();
                        if (monthDiff > 0) {
                            return monthDiff === 1 ? `${monthDiff} month ago` : `${monthDiff} months ago`;
                        }
                        const dayDiff = currentTime.getDate() - lastUpdated.getDate();
                        if (dayDiff > 0) {
                            return dayDiff === 1 ? `${dayDiff} day ago` : `${dayDiff} days ago`;
                        }
                        const hourDiff = currentTime.getHours() - lastUpdated.getHours();
                        if (hourDiff < 0) {
                            hourDiff = 24 + hourDiff;
                        }
                        if (hourDiff > 0) {
                            return hourDiff === 1 ? `${hourDiff} hour ago` : `${hourDiff} hours ago`;
                        }
                        const minuteDiff = currentTime.getMinutes() - lastUpdated.getMinutes();
                        return minuteDiff === 1 ? `${minuteDiff} minute ago` : `${minuteDiff} minutes ago`;
                        //- return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                    }
                }
            ],
            order: [[1, 'asc']],
            pageLength: 5,
        });
    } else {
        $('#league-table').DataTable({
            dom: '<<t>p>',
            data: data,
            columns: [
                { 
                    data: null, 
                    orderable: false, 
                    searchable: false, 
                    render: function (data, type, row) { return '<a class="btn btn-sm btn-success play-btn" href="' + path + row._id + '">Play</a>' } 
                },
                { data: "name", title: "League", className: "t-league-main" },
                { data: "team", title: "Team", className: "t-league-main", defaultContent: "", render: function(data, type, row) { return `${row.team.teamName}` } },
            ],
            order: [[1, 'asc']],
            pageLength: 3,
        });
    }
});