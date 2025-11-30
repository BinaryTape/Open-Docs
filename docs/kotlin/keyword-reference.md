[//]: # (title: 关键字和操作符)

## 硬关键字

以下令牌始终被解释为关键字，不能用作标识符：

* `as`
    - 用于[类型转换](typecasts.md#unsafe-cast-operator)。
    - 为[导入](packages.md#imports)指定[别名]。
* `as?` 用于[安全类型转换](typecasts.md#unsafe-cast-operator)。
* `break` [终止循环的执行](returns.md)。
* `class` 声明一个[类](classes.md)。
* `continue` [继续执行最近封闭循环的下一步](returns.md)。
* `do` 开始一个[do/while 循环](control-flow.md#while-loops)（带后置条件的循环）。
* `else` 定义当条件为 `false` 时执行的 [if 表达式](control-flow.md#if-expression)分支。
* `false` 指定 [Boolean 类型](booleans.md)的 `false` 值。
* `for` 开始一个 [for 循环](control-flow.md#for-loops)。
* `fun` 声明一个[函数](functions.md)。
* `if` 开始一个 [if 表达式](control-flow.md#if-expression)。
* `in`
    - 指定 [for 循环](control-flow.md#for-loops)中被迭代的对象。
    - 用作中缀操作符，[检测](operator-overloading.md#in-operator)一个值是否属于[区间](ranges.md)、集合或其他[定义 `contains` 方法](operator-overloading.md#in-operator)的实体。
    - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
    - 将类型形参标记为[逆变](generics.md#declaration-site-variance)。
* `!in`
    - 用作操作符，[检测](operator-overloading.md#in-operator)一个值是否**不**属于[区间](ranges.md)、集合或其他[定义 `contains` 方法](operator-overloading.md#in-operator)的实体。
    - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
* `interface` 声明一个[接口](interfaces.md)。
* `is`
    - [检测](typecasts.md#is-and-is-operators)一个值是否具有特定类型。
    - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
* `!is`
    - [检测](typecasts.md#is-and-is-operators)一个值是否**不**具有特定类型。
    - 在 [when 表达式](control-flow.md#when-expressions-and-statements)中用于相同目的。
* `null` 是表示不指向任何对象的对象引用的常量。
* `object` [同时声明一个类及其实例](object-declarations.md)。
* `package` 指定[当前文件的包](packages.md)。
* `return` [从最近封闭的函数或匿名函数返回](returns.md)。
* `super`
    - [引用方法或属性的超类实现](inheritance.md#calling-the-superclass-implementation)。
    - [从二级构造函数调用超类构造函数](classes.md#inheritance)。
* `this`
    - 引用[当前接收者](this-expressions.md)。
    - [从二级构造函数调用同一个类的另一个构造函数](classes.md#constructors-and-initializer-blocks)。
* `throw` [抛出异常](exceptions.md)。
* `true` 指定 [Boolean 类型](booleans.md)的 `true` 值。
* `try` [开始一个异常处理块](exceptions.md)。
* `typealias` 声明一个[类型别名](type-aliases.md)。
* `typeof` 保留供 future 使用。
* `val` 声明一个只读[属性](properties.md)或[局部变量](basic-syntax.md#variables)。
* `var` 声明一个可变[属性](properties.md)或[局部变量](basic-syntax.md#variables)。
* `when` 开始一个 [when 表达式](control-flow.md#when-expressions-and-statements)（执行给定分支之一）。
* `while` 开始一个 [while 循环](control-flow.md#while-loops)（带前置条件的循环）。

## 软关键字

以下令牌在其适用上下文中作为关键字，但在其他上下文中可以用作标识符：

* `by`
    - [将接口的实现委托](delegation.md)给另一个对象。
    - [将属性访问器的实现委托](delegated-properties.md)给另一个对象。
* `catch` 开始一个[处理特定异常类型](exceptions.md)的块。
* `constructor` 声明一个[主构造函数或二级构造函数](classes.md#constructors-and-initializer-blocks)。
* `delegate` 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `dynamic` 在 Kotlin/JS 代码中引用[动态类型](dynamic-type.md)。
* `field` 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `file` 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `finally` 开始一个[try 块退出时始终执行](exceptions.md)的块。
* `get`
    - 声明[属性的 getter](properties.md)。
    - 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `import` [将声明从另一个包导入到当前文件](packages.md)。
* `init` 开始一个[初始化块](classes.md#constructors-and-initializer-blocks)。
* `param` 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `property` 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `receiver` 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `set`
    - 声明[属性的 setter](properties.md)。
    - 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `setparam` 用作[注解使用点目标](annotations.md#annotation-use-site-targets)。
* `value` 与 `class` 关键字一起声明一个[内联类](inline-classes.md)。
* `where` 为泛型类型形参指定[约束](generics.md#upper-bounds)。

## 修饰符关键字

以下令牌在声明的修饰符列表中作为关键字，但在其他上下文中可以用作标识符：

* `abstract` 将类或成员标记为[抽象](classes.md#abstract-classes)。
* `actual` 在[多平台项目](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)中表示平台特有的实现。
* `annotation` 声明一个[注解类](annotations.md)。
* `companion` 声明一个[伴生对象](object-declarations.md#companion-objects)。
* `const` 将属性标记为[编译期常量](properties.md#compile-time-constants)。
* `crossinline` 禁止在传递给内联函数的 lambda 中[非局部返回](inline-functions.md#returns)。
* `data` 指示编译器为类[生成规范成员](data-classes.md)。
* `enum` 声明一个[枚举](enum-classes.md)。
* `expect` 将声明标记为[平台特有](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，期望在平台模块中实现。
* `external` 将声明标记为在 Kotlin 之外实现（可通过 [JNI](java-interop.md#using-jni-with-kotlin) 或在 [JavaScript](js-interop.md#external-modifier) 中访问）。
* `final` 禁止[覆盖成员](inheritance.md#overriding-methods)。
* `infix` 允许使用[中缀表示法](functions.md#infix-notation)调用函数。
* `inline` 告诉编译器在调用点[内联函数及其传递的 lambda 表达式](inline-functions.md)。
* `inner` 允许从[嵌套类](nested-classes.md)引用外部类实例。
* `internal` 将声明标记为[在当前模块中可见](visibility-modifiers.md)。
* `lateinit` 允许在[构造函数]之外初始化[非空属性](properties.md#late-initialized-properties-and-variables)。
* `noinline` 关闭[传递给内联函数的 lambda 的内联](inline-functions.md#noinline)。
* `open` 允许[子类化一个类或覆盖成员](classes.md#inheritance)。
* `operator` 将函数标记为[重载操作符或实现约定](operator-overloading.md)。
* `out` 将类型形参标记为[协变](generics.md#declaration-site-variance)。
* `override` 将成员标记为[超类成员的覆盖](inheritance.md#overriding-methods)。
* `private` 将声明标记为[在当前类或文件中可见](visibility-modifiers.md)。
* `protected` 将声明标记为[在当前类及其子类中可见](visibility-modifiers.md)。
* `public` 将声明标记为[在任何地方可见](visibility-modifiers.md)。
* `reified` 将内联函数的类型形参标记为[运行时可访问](inline-functions.md#reified-type-parameters)。
* `sealed` 声明一个[密封类](sealed-classes.md)（具有受限子类化的类）。
* `suspend` 将函数或 lambda 标记为挂起（可用作[协程](coroutines-overview.md)）。
* `tailrec` 将函数标记为[尾递归](functions.md#tail-recursive-functions)（允许编译器用迭代替换递归）。
* `vararg` 允许[为形参传递可变数量的实参](functions.md#variable-number-of-arguments-varargs)。

## 特殊标识符

以下标识符由编译器在特定上下文中定义，但在其他上下文中可以用作常规标识符：

* `field` 在属性访问器内部使用，引用[属性的幕后字段](properties.md#backing-fields)。
* `it` 在 lambda 内部使用，[隐式引用其形参](lambdas.md#it-implicit-name-of-a-single-parameter)。

## 操作符和特殊符号

Kotlin 支持以下操作符和特殊符号：

* `+`, `-`, `*`, `/`, `%` - 数学操作符
    - `*` 也用于[将数组传递给 vararg 形参](functions.md#variable-number-of-arguments-varargs)。
* `=`
    - 赋值操作符。
    - 用于为[形参](functions.md#parameters-with-default-values)指定[默认值]。
* `+=`, `-=`, `*=`, `/=`, `%=` - [增广赋值操作符](operator-overloading.md#augmented-assignments)。
* `++`, `--` - [递增和递减操作符](operator-overloading.md#increments-and-decrements)。
* `&&`, `||`, `!` - 逻辑“与”、“或”、“非”操作符（对于位操作，请改用相应的[中缀函数](numbers.md#operations-on-numbers)）。
* `==`, `!=` - [相等操作符](operator-overloading.md#equality-and-inequality-operators)（对于非原语类型，转换为 `equals()` 调用）。
* `===`, `!==` - [引用相等操作符](equality.md#referential-equality)。
* `<`, `>`, `<=`, `>=` - [比较操作符](operator-overloading.md#comparison-operators)（对于非原语类型，转换为 `compareTo()` 调用）。
* `[`, `]` - [索引访问操作符](operator-overloading.md#indexed-access-operator)（转换为 `get` 和 `set` 调用）。
* `!!` [断言表达式为非空的](null-safety.md#not-null-assertion-operator)。
* `?.` 执行[安全调用](null-safety.md#safe-call-operator)（如果接收者是非空的，则调用方法或访问属性）。
* `?:` 如果左侧值为 `null`，则取右侧值（[Elvis 操作符](null-safety.md#elvis-operator)）。
* `::` 创建[成员引用](reflection.md#function-references)或[类引用](reflection.md#class-references)。
* `..`, `..<` 创建[区间](ranges.md)。
* `:` 在声明中将名称与类型分开。
* `?` 将类型标记为[可空的](null-safety.md#nullable-types-and-non-nullable-types)。
* `->`
    - 分隔[lambda 表达式](lambdas.md#lambda-expression-syntax)的形参和函数体。
    - 分隔[函数类型](lambdas.md#function-types)的形参和返回类型声明。
    - 分隔 [when 表达式](control-flow.md#when-expressions-and-statements)分支的条件和函数体。
* `@`
    - 引入[注解](annotations.md#usage)。
    - 引入或引用[循环标签](returns.md#break-and-continue-labels)。
    - 引入或引用[lambda 标签](returns.md#return-to-labels)。
    - 引用[来自外部作用域的 'this' 表达式](this-expressions.md#qualified-this)。
    - 引用[外部超类](inheritance.md#calling-the-superclass-implementation)。
* `;` 分隔同一行上的多个语句。
     引用[字符串模板](strings.md#string-templates)中的变量或表达式。
* `_`
    - 在 [lambda 表达式](lambdas.md#underscore-for-unused-variables)中替换未使用的形参。
    - 在[解构声明](destructuring-declarations.md#underscore-for-unused-variables)中替换未使用的形参。

关于操作符优先级，请参见 Kotlin 语法中的[此参考](https://kotlinlang.org/docs/reference/grammar.html#expressions)。