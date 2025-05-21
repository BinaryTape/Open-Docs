---
title: 关键字和运算符
---
## 硬关键字 (Hard keywords)

以下 token 总是被解释为关键字，不能用作标识符：

 * `as`
     - 用于[类型转换](typecasts#unsafe-cast-operator)。
     - 指定 [import 的别名](packages#imports)
 * `as?` 用于[安全类型转换](typecasts#safe-nullable-cast-operator)。
 * `break` [终止循环的执行](returns)。
 * `class` 声明一个 [类](classes)。
 * `continue` [继续执行最近的封闭循环的下一步](returns)。
 * `do` 开始一个 [do/while 循环](control-flow#while-loops) (一个带有后置条件的循环)。
 * `else` 定义 [if 表达式](control-flow#if-expression) 的分支，该分支在条件为假时执行。
 * `false` 指定 [Boolean 类型](booleans) 的 'false' 值。
 * `for` 开始一个 [for 循环](control-flow#for-loops)。
 * `fun` 声明一个 [函数](functions)。
 * `if` 开始一个 [if 表达式](control-flow#if-expression)。
 * `in`
     - 指定在 [for 循环](control-flow#for-loops) 中迭代的对象。
     - 用作中缀运算符，以检查一个值是否属于[一个范围](ranges)、
       一个集合，或者另一个[定义了 'contains' 方法](operator-overloading#in-operator)的实体。
     - 用于 [when 表达式](control-flow#when-expressions-and-statements) 中，用于相同的目的。
     - 将类型参数标记为 [逆变 (contravariant)](generics#declaration-site-variance)。
 * `!in`
     - 用作运算符，以检查一个值是否不属于[一个范围](ranges)、
       一个集合，或者另一个[定义了 'contains' 方法](operator-overloading#in-operator)的实体。
     - 用于 [when 表达式](control-flow#when-expressions-and-statements) 中，用于相同的目的。
 * `interface` 声明一个 [接口](interfaces)。
 * `is`
     - 检查[一个值是否具有某种类型](typecasts#is-and-is-operators)。
     - 用于 [when 表达式](control-flow#when-expressions-and-statements) 中，用于相同的目的。
 * `!is`
     - 检查[一个值是否不具有某种类型](typecasts#is-and-is-operators)。
     - 用于 [when 表达式](control-flow#when-expressions-and-statements) 中，用于相同的目的。
 * `null` 是一个常量，表示一个不指向任何对象的对象引用。
 * `object` 同时声明 [一个类及其实例](object-declarations)。
 * `package` 指定 [当前文件的包](packages)。
 * `return` [从最近的封闭函数或匿名函数返回](returns)。
 * `super`
     - [引用方法或属性的超类实现](inheritance#calling-the-superclass-implementation)。
     - [从二级构造函数调用超类构造函数](classes#inheritance)。
 * `this`
     - 引用 [当前的接收者](this-expressions)。
     - [从二级构造函数调用同一类的另一个构造函数](classes#constructors)。
 * `throw` [抛出一个异常](exceptions)。
 * `true` 指定 [Boolean 类型](booleans) 的 'true' 值。
 * `try` [开始一个异常处理块](exceptions)。
 * `typealias` 声明一个 [类型别名](type-aliases)。
 * `typeof` 保留供将来使用。
 * `val` 声明一个只读 [属性](properties) 或 [局部变量](basic-syntax#variables)。
 * `var` 声明一个可变 [属性](properties) 或 [局部变量](basic-syntax#variables)。
 * `when` 开始一个 [when 表达式](control-flow#when-expressions-and-statements) (执行给定的分支之一)。
 * `while` 开始一个 [while 循环](control-flow#while-loops) (一个带有前置条件的循环)。

## 软关键字 (Soft keywords)

以下 token 在其适用的上下文中充当关键字，并且可以在其他上下文中用作标识符：

 * `by`
     - [将接口的实现委托给另一个对象](delegation)。
     - [将属性的访问器的实现委托给另一个对象](delegated-properties)。
 * `catch` 开始一个 [处理特定异常类型](exceptions) 的块。
 * `constructor` 声明一个 [主构造函数或二级构造函数](classes#constructors)。
 * `delegate` 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
 * `dynamic` 引用 Kotlin/JS 代码中的 [动态类型](dynamic-type)。
 * `field` 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
 * `file` 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
 * `finally` 开始一个 [try 块退出时始终执行](exceptions) 的块。
 * `get`
     - 声明 [属性的 getter](properties#getters-and-setters)。
     - 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
 * `import` [将来自另一个包的声明导入到当前文件中](packages)。
 * `init` 开始一个 [初始化块](classes#constructors)。
 * `param` 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
 * `property` 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
 * `receiver` 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
 * `set`
     - 声明 [属性的 setter](properties#getters-and-setters)。
     - 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
* `setparam` 用作 [注解使用点目标 (annotation use-site target)](annotations#annotation-use-site-targets)。
* `value` 与 `class` 关键字一起使用，声明一个 [内联类 (inline class)](inline-classes)。
* `where` 指定 [泛型类型参数的约束](generics#upper-bounds)。

## 修饰符关键字 (Modifier keywords)

以下 token 在声明的修饰符列表中充当关键字，并且可以在其他上下文中用作标识符：

 * `abstract` 将类或成员标记为 [抽象 (abstract)](classes#abstract-classes)。
 * `actual` 表示 [多平台项目](multiplatform-expect-actual) 中特定于平台的实现。
 * `annotation` 声明一个 [注解类](annotations)。
 * `companion` 声明一个 [伴生对象](object-declarations#companion-objects)。
 * `const` 将属性标记为 [编译时常量](properties#compile-time-constants)。
 * `crossinline` 禁止 [传递给内联函数的 lambda 中的非局部返回](inline-functions#returns)。
 * `data` 指示编译器 [为一个类生成规范成员](data-classes)。
 * `enum` 声明一个 [枚举](enum-classes)。
 * `expect` 将声明标记为 [特定于平台](multiplatform-expect-actual)，期望在平台模块中实现。
 * `external` 将声明标记为在 Kotlin 之外实现（可通过 [JNI](java-interop#using-jni-with-kotlin) 或在 [JavaScript](js-interop#external-modifier) 中访问）。
 * `final` 禁止 [重写成员](inheritance#overriding-methods)。
 * `infix` 允许使用 [中缀表示法](functions#infix-notation) 调用函数。
 * `inline` 告诉编译器 [在调用点内联一个函数和传递给它的 lambda](inline-functions)。
 * `inner` 允许从 [嵌套类](nested-classes) 引用外部类实例。
 * `internal` 将声明标记为 [在当前模块中可见](visibility-modifiers)。
 * `lateinit` 允许在 [构造函数之外初始化非空属性](properties#late-initialized-properties-and-variables)。
 * `noinline` 关闭 [传递给内联函数的 lambda 的内联](inline-functions#noinline)。
 * `open` 允许 [子类化一个类或重写一个成员](classes#inheritance)。
 * `operator` 将函数标记为 [重载运算符或实现约定](operator-overloading)。
 * `out` 将类型参数标记为 [协变 (covariant)](generics#declaration-site-variance)。
 * `override` 将成员标记为 [超类成员的重写](inheritance#overriding-methods)。
 * `private` 将声明标记为 [在当前类或文件中可见](visibility-modifiers)。
 * `protected` 将声明标记为 [在当前类及其子类中可见](visibility-modifiers)。
 * `public` 将声明标记为 [在任何地方可见](visibility-modifiers)。
 * `reified` 将内联函数的类型参数标记为 [在运行时可访问](inline-functions#reified-type-parameters)。
 * `sealed` 声明一个 [密封类](sealed-classes) (一个具有受限子类化的类)。
 * `suspend` 将函数或 lambda 标记为挂起 (可用作 [协程](coroutines-overview))。
 * `tailrec` 将函数标记为 [尾递归](functions#tail-recursive-functions) (允许编译器用迭代替换递归)。
 * `vararg` 允许 [为参数传递可变数量的参数](functions#variable-number-of-arguments-varargs)。

## 特殊标识符 (Special identifiers)

以下标识符由编译器在特定上下文中定义，并且可以在其他上下文中用作常规标识符：

 * `field` 在属性访问器内部用于引用 [属性的幕后字段](properties#backing-fields)。
 * `it` 在 lambda 内部用于 [隐式引用其参数](lambdas#it-implicit-name-of-a-single-parameter)。

## 运算符和特殊符号 (Operators and special symbols)

Kotlin 支持以下运算符和特殊符号：

 * `+`, `-`, `*`, `/`, `%` - 数学运算符
     - `*` 也用于 [将数组传递给 vararg 参数](functions#variable-number-of-arguments-varargs)。
 * `=`
     - 赋值运算符。
     - 用于指定 [参数的默认值](functions#default-arguments)。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [增强赋值运算符](operator-overloading#augmented-assignments)。
 * `++`, `--` - [递增和递减运算符](operator-overloading#increments-and-decrements)。
 * `&&`, `||`, `!` - 逻辑 'and'、'or'、'not' 运算符（对于按位运算，请改用相应的 [中缀函数](numbers#operations-on-numbers)）。
 * `==`, `!=` - [相等运算符](operator-overloading#equality-and-inequality-operators) (对于非原始类型，转换为 `equals()` 的调用)。
 * `===`, `!==` - [引用相等运算符](equality#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比较运算符](operator-overloading#comparison-operators) (对于非原始类型，转换为 `compareTo()` 的调用)。
 * `[`, `]` - [索引访问运算符](operator-overloading#indexed-access-operator) (转换为 `get` 和 `set` 的调用)。
 * `!!` [断言表达式是非空的](null-safety#not-null-assertion-operator)。
 * `?.` 执行 [安全调用](null-safety#safe-call-operator) (如果接收者是非空的，则调用方法或访问属性)。
 * `?:` 如果左侧的值为空，则采用右侧的值 ([elvis 运算符](null-safety#elvis-operator))。
 * `::` 创建一个 [成员引用](reflection#function-references) 或一个 [类引用](reflection#class-references)。
 * `..`, `..<` 创建 [范围](ranges)。
 * `:` 在声明中将名称与类型分开。
 * `?` 将类型标记为 [可空](null-safety#nullable-types-and-non-nullable-types)。
 * `->`
     - 分隔 [lambda 表达式](lambdas#lambda-expression-syntax) 的参数和主体。
     - 分隔 [函数类型](lambdas#function-types) 中的参数和返回类型声明。
     - 分隔 [when 表达式](control-flow#when-expressions-and-statements) 分支的条件和主体。
 * `@`
     - 引入一个 [注解](annotations#usage)。
     - 引入或引用一个 [循环标签](returns#break-and-continue-labels)。
     - 引入或引用一个 [lambda 标签](returns#return-to-labels)。
     - 引用 [来自外部作用域的 'this' 表达式](this-expressions#qualified-this)。
     - 引用一个 [外部超类](inheritance#calling-the-superclass-implementation)。
 * `;` 分隔同一行上的多个语句。
 * `$` 引用 [字符串模板](strings#string-templates) 中的变量或表达式。
 * `_`
     - 替换 [lambda 表达式](lambdas#underscore-for-unused-variables) 中未使用的参数。
     - 替换 [解构声明](destructuring-declarations#underscore-for-unused-variables) 中未使用的参数。

有关运算符优先级，请参阅 Kotlin 语法中的 [此参考](https://kotlinlang.org/docs/reference/grammar.html#expressions)。