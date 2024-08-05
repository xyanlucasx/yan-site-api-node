const bcrypt =  require("bcrypt");

const hashValue = async (value) => {
  const saltRounds = 14;
  const hashValue = await bcrypt.hash(value, saltRounds);
  console.log(hashValue);
  return hashValue;
};

const compareHash = async (value, hash) => {
  const result = await bcrypt.compare(value, hash);
  return result;
};

module.exports = {
  hashValue,
  compareHash,
};