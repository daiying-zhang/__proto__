Person:
|--length
|--name
|--arguments
|--caller
|--prototype
|  |--constructor
循环依赖 proto.js:162
|  |--sayName
|  |  |--length
|  |  |--name
|  |  |--arguments
|  |  |--caller
|  |  |--prototype [sayName.prototype]
|  |  |  |--constructor [sayName]
循环依赖 proto.js:162 (ok)
|  |  |  |--__proto__ [sayName.prototype.__proto__]
|  |  |     |--constructor
|  |  |     |  |--length
|  |  |     |  |--name
|  |  |     |  |--arguments
|  |  |     |  |--caller
|  |  |     |  |--prototype
循环依赖 proto.js:162
|  |  |     |  |--keys
|  |  |     |  |--create
|  |  |     |  |--defineProperty
|  |  |     |  |--defineProperties
|  |  |     |  |--freeze
|  |  |     |  |--getPrototypeOf
|  |  |     |  |--setPrototypeOf
|  |  |     |  |--getOwnPropertyDescriptor
|  |  |     |  |--getOwnPropertyNames
|  |  |     |  |--is
|  |  |     |  |--isExtensible
|  |  |     |  |--isFrozen
|  |  |     |  |--isSealed
|  |  |     |  |--preventExtensions
|  |  |     |  |--seal
|  |  |     |  |--deliverChangeRecords
|  |  |     |  |  |--length
|  |  |     |  |  |--name
|  |  |     |  |  |--arguments
