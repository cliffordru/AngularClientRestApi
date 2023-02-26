var falso = require('@ngneat/falso');

var database = { patients: [] };

for (var i = 1; i <= 2; i++) {
    var birth = falso.randPastDate({ length: 1});
    var gender = falso.randGender({ length: 1});

    database.patients.push({
        id: i,
        firstName: falso.randFirstName(),
        lastName: falso.randLastName(),
        birthday: birth,
        gender: gender
    });
}

console.log(JSON.stringify(database));