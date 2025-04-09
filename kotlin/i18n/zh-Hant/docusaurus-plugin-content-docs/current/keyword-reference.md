---
title: 關鍵字與運算符
---
## 硬性關鍵字 (Hard keywords)

以下token 總是會被解析為關鍵字，不能當作識別符 (identifiers) 使用：

 * `as`
     - 用於[類型轉換](typecasts#unsafe-cast-operator)。
     - 指定[導入 (import) 的別名](packages#imports)
 * `as?` 用於[安全的類型轉換](typecasts#safe-nullable-cast-operator)。
 * `break` [終止迴圈的執行](returns)。
 * `class` 宣告一個[類別 (class)](classes)。
 * `continue` [繼續執行最近一層封閉迴圈的下一次迭代](returns)。
 * `do` 開始一個 [do/while 迴圈](control-flow#while-loops) (帶有後置條件的迴圈)。
 * `else` 定義 [if 表達式](control-flow#if-expression) 的一個分支，該分支在條件為 false 時執行。
 * `false` 指定 [Boolean 類型](booleans) 的 'false' 值。
 * `for` 開始一個 [for 迴圈](control-flow#for-loops)。
 * `fun` 宣告一個 [函數 (function)](functions)。
 * `if` 開始一個 [if 表達式](control-flow#if-expression)。
 * `in`
     - 指定在 [for 迴圈](control-flow#for-loops) 中被迭代的對象。
     - 用作中綴運算符 (infix operator)，檢查一個值是否屬於 [一個範圍 (range)](ranges)、
       一個集合 (collection) 或另一個 [定義了 'contains' 方法](operator-overloading#in-operator) 的實體。
     - 在 [when 表達式](control-flow#when-expressions-and-statements) 中用於相同的目的。
     - 將類型參數標記為 [逆變 (contravariant)](generics#declaration-site-variance)。
 * `!in`
     - 用作一個運算符 (operator)，檢查一個值是否 *不* 屬於 [一個範圍 (range)](ranges)、
       一個集合 (collection) 或另一個 [定義了 'contains' 方法](operator-overloading#in-operator) 的實體。
     - 在 [when 表達式](control-flow#when-expressions-and-statements) 中用於相同的目的。
 * `interface` 宣告一個 [介面 (interface)](interfaces)。
 * `is`
     - 檢查 [一個值是否具有某種類型](typecasts#is-and-is-operators)。
     - 在 [when 表達式](control-flow#when-expressions-and-statements) 中用於相同的目的。
 * `!is`
     - 檢查 [一個值是否 *不* 具有某種類型](typecasts#is-and-is-operators)。
     - 在 [when 表達式](control-flow#when-expressions-and-statements) 中用於相同的目的。
 * `null` 是一個常量，表示不指向任何對象的對象引用。
 * `object` 同時宣告 [一個類別 (class) 及其實例](object-declarations)。
 * `package` 指定 [目前檔案的套件 (package)](packages)。
 * `return` [從最近一層封閉函數或匿名函數返回](returns)。
 * `super`
     - [引用方法或屬性的超類實現](inheritance#calling-the-superclass-implementation)。
     - [從輔助建構函數 (secondary constructor) 呼叫超類建構函數](classes#inheritance)。
 * `this`
     - 引用 [當前接收者 (receiver)](this-expressions)。
     - [從輔助建構函數呼叫同一個類別的另一個建構函數](classes#constructors)。
 * `throw` [拋出一個異常 (exception)](exceptions)。
 * `true` 指定 [Boolean 類型](booleans) 的 'true' 值。
 * `try` [開始一個異常處理區塊](exceptions)。
 * `typealias` 宣告一個 [類型別名 (type alias)](type-aliases)。
 * `typeof` 保留供未來使用。
 * `val` 宣告一個只讀 [屬性 (property)](properties) 或 [區域變數 (local variable)](basic-syntax#variables)。
 * `var` 宣告一個可變 [屬性 (property)](properties) 或 [區域變數 (local variable)](basic-syntax#variables)。
 * `when` 開始一個 [when 表達式](control-flow#when-expressions-and-statements) (執行給定分支之一)。
 * `while` 開始一個 [while 迴圈](control-flow#while-loops) (帶有前置條件的迴圈)。

## 軟性關鍵字 (Soft keywords)

以下token 在適用的上下文中充當關鍵字，它們可以在其他上下文中用作識別符 (identifiers)：

 * `by`
     - [將介面的實現委託給另一個對象](delegation)。
     - [將屬性的訪問器 (accessor) 的實現委託給另一個對象](delegated-properties)。
 * `catch` 開始一個 [處理特定異常類型](exceptions) 的區塊。
 * `constructor` 宣告一個 [主要或輔助建構函數](classes#constructors)。
 * `delegate` 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
 * `dynamic` 在 Kotlin/JS 代碼中引用一個 [dynamic 類型](dynamic-type)。
 * `field` 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
 * `file` 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
 * `finally` 開始一個 [當 try 區塊退出時始終執行的區塊](exceptions)。
 * `get`
     - 宣告 [屬性的 getter](properties#getters-and-setters)。
     - 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
 * `import` [將另一個套件 (package) 中的宣告導入到當前檔案](packages)。
 * `init` 開始一個 [初始化區塊](classes#constructors)。
 * `param` 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
 * `property` 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
 * `receiver` 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
 * `set`
     - 宣告 [屬性的 setter](properties#getters-and-setters)。
     - 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
* `setparam` 用作 [annotation use-site target](annotations#annotation-use-site-targets)。
* `value` 搭配 `class` 關鍵字宣告一個 [inline class](inline-classes)。
* `where` 指定 [泛型類型參數的約束](generics#upper-bounds)。

## 修飾符關鍵字 (Modifier keywords)

以下token 在宣告的修飾符列表中充當關鍵字，它們可以在其他上下文中用作識別符 (identifiers)：

 * `abstract` 將類別 (class) 或成員標記為 [抽象 (abstract)](classes#abstract-classes)。
 * `actual` 表示 [多平台專案](multiplatform-expect-actual) 中特定於平台的實現。
 * `annotation` 宣告一個 [annotation class](annotations)。
 * `companion` 宣告一個 [伴生對象 (companion object)](object-declarations#companion-objects)。
 * `const` 將屬性標記為 [編譯時常量](properties#compile-time-constants)。
 * `crossinline` 禁止 [傳遞給 inline 函數的 lambda 中的非本地返回](inline-functions#returns)。
 * `data` 指示編譯器 [為類別 (class) 生成規範成員](data-classes)。
 * `enum` 宣告一個 [枚舉 (enumeration)](enum-classes)。
 * `expect` 將宣告標記為 [特定於平台](multiplatform-expect-actual)，期望在平台模組中實現。
 * `external` 將宣告標記為在 Kotlin 之外實現 (可通過 [JNI](java-interop#using-jni-with-kotlin) 或在 [JavaScript](js-interop#external-modifier) 中訪問)。
 * `final` 禁止 [覆寫 (overriding) 成員](inheritance#overriding-methods)。
 * `infix` 允許使用 [中綴表示法](functions#infix-notation) 呼叫函數。
 * `inline` 告訴編譯器 [在呼叫位置 inline 一個函數和傳遞給它的 lambda](inline-functions)。
 * `inner` 允許從 [巢狀類別](nested-classes) 引用外部類別實例。
 * `internal` 將宣告標記為 [在當前模組中可見](visibility-modifiers)。
 * `lateinit` 允許在 [建構函數 (constructor) 之外初始化一個不可為 null 的屬性](properties#late-initialized-properties-and-variables)。
 * `noinline` 關閉 [傳遞給 inline 函數的 lambda 的 inline](inline-functions#noinline)。
 * `open` 允許 [子類化一個類別 (class) 或覆寫一個成員](classes#inheritance)。
 * `operator` 將函數標記為 [覆載運算符 (overloading an operator) 或實現一個約定](operator-overloading)。
 * `out` 將類型參數標記為 [協變 (covariant)](generics#declaration-site-variance)。
 * `override` 將成員標記為 [超類成員的覆寫](inheritance#overriding-methods)。
 * `private` 將宣告標記為 [在當前類別 (class) 或檔案中可見](visibility-modifiers)。
 * `protected` 將宣告標記為 [在當前類別及其子類中可見](visibility-modifiers)。
 * `public` 將宣告標記為 [在任何地方都可見](visibility-modifiers)。
 * `reified` 將 inline 函數的類型參數標記為 [在運行時可訪問](inline-functions#reified-type-parameters)。
 * `sealed` 宣告一個 [密封類別 (sealed class)](sealed-classes) (具有受限子類化的類別)。
 * `suspend` 將函數或 lambda 標記為 suspending (可用作 [協程 (coroutine)](coroutines-overview))。
 * `tailrec` 將函數標記為 [尾遞迴 (tail-recursive)](functions#tail-recursive-functions) (允許編譯器用迭代替換遞迴)。
 * `vararg` 允許 [為參數傳遞可變數量的參數](functions#variable-number-of-arguments-varargs)。

## 特殊識別符 (Special identifiers)

以下識別符 (identifiers) 由編譯器在特定上下文中定義，它們可以在其他上下文中用作常規識別符 (identifiers)：

 * `field` 在屬性訪問器 (accessor) 內部用於引用 [屬性的 backing field](properties#backing-fields)。
 * `it` 在 lambda 內部用於 [隱式引用其參數](lambdas#it-implicit-name-of-a-single-parameter)。

## 運算符和特殊符號 (Operators and special symbols)

Kotlin 支援以下運算符和特殊符號：

 * `+`, `-`, `*`, `/`, `%` - 數學運算符 (mathematical operators)
     - `*` 也用於 [將陣列 (array) 傳遞給 vararg 參數](functions#variable-number-of-arguments-varargs)。
 * `=`
     - 賦值運算符 (assignment operator)。
     - 用於指定 [參數的預設值](functions#default-arguments)。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [增強賦值運算符 (augmented assignment operators)](operator-overloading#augmented-assignments)。
 * `++`, `--` - [遞增和遞減運算符 (increment and decrement operators)](operator-overloading#increments-and-decrements)。
 * `&&`, `||`, `!` - 邏輯 'and'、'or'、'not' 運算符 (對於位元運算，請改用相應的 [中綴函數](numbers#operations-on-numbers))。
 * `==`, `!=` - [相等運算符 (equality operators)](operator-overloading#equality-and-inequality-operators) (對於非原始類型，翻譯為 `equals()` 的呼叫)。
 * `===`, `!==` - [引用相等運算符 (referential equality operators)](equality#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較運算符 (comparison operators)](operator-overloading#comparison-operators) (對於非原始類型，翻譯為 `compareTo()` 的呼叫)。
 * `[`, `]` - [索引訪問運算符 (indexed access operator)](operator-overloading#indexed-access-operator) (翻譯為 `get` 和 `set` 的呼叫)。
 * `!!` [斷言表達式不可為 null](null-safety#not-null-assertion-operator)。
 * `?.` 執行 [安全呼叫](null-safety#safe-call-operator) (如果接收者不可為 null，則呼叫方法或訪問屬性)。
 * `?:` 如果左側值為 null，則採用右側值 ([elvis 運算符](null-safety#elvis-operator))。
 * `::` 創建一個 [成員引用](reflection#function-references) 或一個 [類別引用](reflection#class-references)。
 * `..`, `..<` 創建 [範圍 (ranges)](ranges)。
 * `:` 在宣告中將名稱與類型分開。
 * `?` 將類型標記為 [可為 null](null-safety#nullable-types-and-non-nullable-types)。
 * `->`
     - 分隔 [lambda 表達式](lambdas#lambda-expression-syntax) 的參數和主體。
     - 分隔 [函數類型](lambdas#function-types) 中的參數和返回類型宣告。
     - 分隔 [when 表達式](control-flow#when-expressions-and-statements) 分支的條件和主體。
 * `@`
     - 引入一個 [annotation](annotations#usage)。
     - 引入或引用一個 [迴圈標籤](returns#break-and-continue-labels)。
     - 引入或引用一個 [lambda 標籤](returns#return-to-labels)。
     - 從 [外部作用域](this-expressions#qualified-this) 引用一個 'this' 表達式。
     - 引用一個 [外部超類](inheritance#calling-the-superclass-implementation)。
 * `;` 分隔同一行上的多個語句。
 * `` 引用 [字串模板](strings#string-templates) 中的變數或表達式。
 * `_`
     - 替換 [lambda 表達式](lambdas#underscore-for-unused-variables) 中未使用的參數。
     - 替換 [解構宣告](destructuring-declarations#underscore-for-unused-variables) 中未使用的參數。

有關運算符優先級，請參閱 Kotlin 語法中的 [此參考](https://kotlinlang.org/docs/reference/grammar.html#expressions)。