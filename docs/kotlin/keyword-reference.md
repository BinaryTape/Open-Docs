[//]: # (title: 关键字与运算符)

## 硬关键字

以下标记始终会被解释为关键字，不能用作标识符：

 * `as`
     - 用于[类型转换](typecasts.md#unsafe-cast-operator)。
     - 为[导入指定别名](packages.md#imports)。
 * `as?` 用于[安全类型转换](typecasts.md#unsafe-cast-operator)。
 * `break` [终止循环的执行](returns.md)。
 * `class` 声明一个[类](classes.md)。
 * `continue` [跳转到最近的外层循环的下一步](returns.md)。
 * `do` 开始一个 [do/while 循环](control-flow.md#while-loops)（带后置条件的循环）。
 * `else` 定义 [if 表达式](control-flow.md#if-expression)中条件为 false 时执行的分支。
 * `false` 指定 [Boolean 类型](booleans.md)的“假”值。
 * `for` 开始一个 [for 循环](control-flow.md#for-loops)。
 * `fun` 声明一个[函数](functions.md)。
 * `if` 开始一个 [if 表达式](control-flow.md#if-expression)。
 * `in`
     - 指定在 [for 循环](control-flow.md#for-loops)中迭代的对象。
     - 用作中缀运算符以检查一个值是否属于[一个区间](ranges.md)、一个集合或另一个[定义了 `contains` 方法](operator-overloading.md#in-operator)的实体。
     - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
     - 将类型形参标记为[逆变](generics.md#declaration-site-variance)。
 * `!in`
     - 用作运算符以检查一个值是否**不**属于[一个区间](ranges.md)、一个集合或另一个[定义了 `contains` 方法](operator-overloading.md#in-operator)的实体。
     - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
 * `interface` 声明一个[接口](interfaces.md)。
 * `is`
     - 检查[一个值是否具有特定类型](typecasts.md#is-and-is-operators)。
     - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
 * `!is`
     - 检查[一个值是否**不**具有特定类型](typecasts.md#is-and-is-operators)。
     - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
 * `null` 是一个常量，表示不指向任何对象的对象引用。
 * `object` [同时声明一个类及其实例](object-declarations.md)。
 * `package` 指定[当前文件的软件包](packages.md)。
 * `return` [从最近的外层函数或匿名函数返回](returns.md)。
 * `super`
     - [引用方法或属性的父类实现](inheritance.md#calling-the-superclass-implementation)。
     - [在次构造函数中调用父类构造函数](classes.md#inheritance)。
 * `this`
     - 引用[当前接收者](this-expressions.md)。
     - [在次构造函数中调用同类的另一个构造函数](classes.md#constructors-and-initializer-blocks)。
 * `throw` [抛出异常](exceptions.md)。
 * `true` 指定 [Boolean 类型](booleans.md)的“真”值。
 * `try` [开始一个异常处理块](exceptions.md)。
 * `typealias` 声明一个[类型别名](type-aliases.md)。
 * `typeof` 保留供未来使用。
 * `val` 声明一个只读[属性](properties.md)或[局部变量](basic-syntax.md#variables)。
 * `var` 声明一个可变[属性](properties.md)或[局部变量](basic-syntax.md#variables)。
 * `when` 开始一个 [when 表达式](control-flow.md#when-expressions-and-statements)（执行给定分支之一）。
 * `while` 开始一个 [while 循环](control-flow.md#while-loops)（带前置条件的循环）。

## 软关键字

以下标记在适用的上下文中充当关键字，在其他上下文中可用作标识符：

 * `by`
     - [将接口的实现委托给另一个对象](delegation.md)。
     - [将属性访问器的实现委托给另一个对象](delegated-properties.md)。
 * `catch` 开始一个[处理特定异常类型](exceptions.md)的块。
 * `constructor` 声明一个[主构造函数或次构造函数](classes.md#constructors-and-initializer-blocks)。
 * `delegate` 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
 * `dynamic` 在 Kotlin/JS 代码中引用一个 [dynamic 类型](dynamic-type.md)。
 * `field`
     - 声明一个[显式支持字段](properties.md#explicit-backing-fields)。
     - 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
 * `file` 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
 * `finally` 开始一个[当 try 块退出时总是会执行](exceptions.md)的块。
 * `get`
     - 声明[属性的 getter](properties.md)。
     - 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
 * `import` [将另一个软件包中的声明导入到当前文件](packages.md)。
 * `init` 开始一个[初始值设定项块](classes.md#constructors-and-initializer-blocks)。
 * `param` 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
 * `property` 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
 * `receiver` 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
 * `set`
     - 声明[属性的 setter](properties.md)。
     - 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
* `setparam` 用作[注解使用处目标](annotations.md#annotation-use-site-targets)。
* `value` 与 `class` 关键字一起声明一个[内联类](inline-classes.md)。
* `where` 指定[泛型类型形参的约束](generics.md#upper-bounds)。

## 修饰符关键字

以下标记在声明的修饰符列表中充当关键字，在其他上下文中可用作标识符：

 * `abstract` 将类或成员标记为[抽象](classes.md#abstract-classes)。
 * `actual` 在[多平台项目](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)中表示平台特定的实现。
 * `annotation` 声明一个[注解类](annotations.md)。
 * `companion` 声明一个[伴生对象](object-declarations.md#companion-objects)。
 * `const` 将属性标记为[编译时常量](properties.md#compile-time-constants)。
 * `crossinline` 禁止[传递给内联函数的 lambda 表达式中的非局部返回](inline-functions.md#returns)。
 * `data` 指示编译器[为类生成规范成员](data-classes.md)。
 * `enum` 声明一个[枚举](enum-classes.md)。
 * `expect` 将声明标记为[平台特定](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，并期待在平台模块中有一个实现。
 * `external` 将声明标记为在 Kotlin 之外实现（通过 [JNI](java-interop.md#using-jni-with-kotlin) 访问或在 [JavaScript](js-interop.md#external-modifier) 中访问）。
 * `final` 禁止[重写成员](inheritance.md#overriding-methods)。
 * `infix` 允许使用[中缀表示法](functions.md#infix-notation)调用函数。
 * `inline` 告诉编译器[在调用处内联函数以及传递给它的 lambda 表达式](inline-functions.md)。
 * `inner` 允许从[嵌套类](nested-classes.md)中引用外部类实例。
 * `internal` 将声明标记为[在当前模块中可见](visibility-modifiers.md)。
 * `lateinit` 允许[在构造函数之外初始化非 null 属性](properties.md#late-initialized-properties-and-variables)。
 * `noinline` 关闭[对传递给内联函数的 lambda 表达式的内联](inline-functions.md#noinline)。
 * `open` 允许[继承类或重写成员](classes.md#inheritance)。
 * `operator` 将函数标记为[重载运算符或实现约定](operator-overloading.md)。
 * `out` 将类型形参标记为[协变](generics.md#declaration-site-variance)。
 * `override` 将成员标记为[对父类成员的重写](inheritance.md#overriding-methods)。
 * `private` 将声明标记为[在当前类或文件中可见](visibility-modifiers.md)。
 * `protected` 将声明标记为[在当前类及其子类中可见](visibility-modifiers.md)。
 * `public` 将声明标记为[随处可见](visibility-modifiers.md)。
 * `reified` 将内联函数的类型形参标记为[在运行时可访问](inline-functions.md#reified-type-parameters)。
 * `sealed` 声明一个[密封类](sealed-classes.md)（限制继承的类）。
 * `suspend` 将函数或 lambda 表达式标记为挂起（可用作[协程](coroutines-overview.md)）。
 * `tailrec` 将函数标记为[尾递归](functions.md#tail-recursive-functions)（允许编译器用迭代代替递归）。
 * `vararg` 允许[为形参传递可变数量的实参](functions.md#variable-number-of-arguments-varargs)。

## 特殊标识符

以下标识符由编译器在特定上下文中定义，在其他上下文中可用作常规标识符：

 * `field` 在属性访问器内部用于引用[属性的支持字段](properties.md#backing-fields)。
 * `it` 在 lambda 表达式内部用于[隐式引用其形参](lambdas.md#it-implicit-name-of-a-single-parameter)。

## 运算符与特殊符号

Kotlin 支持以下运算符和特殊符号：

 * `+`, `-`, `*`, `/`, `%` - 数学运算符
     - `*` 也用于[将数组传递给 vararg 形参](functions.md#variable-number-of-arguments-varargs)。
 * `=`
     - 赋值运算符。
     - 用于指定[形参的默认值](functions.md#parameters-with-default-values)。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [复合赋值运算符](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [递增与递减运算符](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 逻辑“与”、“或”、“非”运算符（对于位运算，请改用相应的[中缀函数](numbers.md#bitwise-operations)）。
 * `==`, `!=` - [相等运算符](operator-overloading.md#equality-and-inequality-operators)（对于非基本类型，翻译为对 `equals()` 的调用）。
 * `===`, `!==` - [引用相等运算符](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比较运算符](operator-overloading.md#comparison-operators)（对于非基本类型，翻译为对 `compareTo()` 的调用）。
 * `[`, `]` - [索引访问运算符](operator-overloading.md#indexed-access-operator)（翻译为对 `get` 和 `set` 的调用）。
 * `!!` [断言一个表达式为非 null](null-safety.md#not-null-assertion-operator)。
 * `?.` 执行[安全调用](null-safety.md#safe-call-operator)（如果接收者非 null，则调用方法或访问属性）。
 * `?:` 如果左侧的值为 null，则取右侧的值（[elvis 运算符](null-safety.md#elvis-operator)）。
 * `::` 创建一个[成员引用](reflection.md#function-references)或[类引用](reflection.md#class-references)。
 * `..`, `..<` 创建[区间](ranges.md)。
 * `:` 在声明中将名称与类型隔开。
 * `?` 将类型标记为[可为 null](null-safety.md#nullable-types-and-non-nullable-types)。
 * `->`
     - 隔开 [lambda 表达式](lambdas.md#lambda-expression-syntax)的形参和主体。
     - 在[函数类型](lambdas.md#function-types)中隔开形参和返回值类型声明。
     - 隔开 [when 表达式](control-flow.md#when-expressions-and-statements)分支的条件和主体。
 * `@`
     - 引入[注解](annotations.md#usage)。
     - 引入或引用[循环标签](returns.md#break-and-continue-labels)。
     - 引入或引用 [lambda 标签](returns.md#return-to-labels)。
     - 引用[来自外部作用域的 'this' 表达式](this-expressions.md#qualified-this)。
     - 引用[外部父类](inheritance.md#calling-the-superclass-implementation)。
 * `;` 隔开同一行中的多个语句。
 * `${` 在[字符串模板](strings.md#string-templates)中引用变量或表达式。
 * `_`
     - 在 [lambda 表达式](lambdas.md#underscore-for-unused-variables)中替代未使用的形参。
     - 在[析构声明](destructuring-declarations.md#underscore-for-unused-variables)中替代未使用的形参。

有关运算符优先级，请参阅 Kotlin 语法中的[此参考资料](https://kotlinlang.org/grammar/#expressions)。