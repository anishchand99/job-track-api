const handleGetList = (req, res, db) => {
  //soft server
  // res.json(listNames);

  //query database
  let userId = parseInt(req.body.id);
  console.log(userId);
  // NEED FRONTEND TO SEND THE USER ID
  db.from('list')
    .select('*')
    .where('id', '=', userId)
    .then((row) => {
      let listName = [];
      row.map((element, index) => {
        // console.log(element.name);
        listName.push(element.name);
      });
      console.log('Print the lists  ', listName);
      res.json(listName);
    })
    .catch((err) => console.log(err));
};
module.exports = {
  handleGetList: handleGetList,
};
