[//]: # (title: 關鍵字與運算子)

## 硬關鍵字 (Hard keywords)

以下標記一律解讀為關鍵字，且不能用作識別符號 (identifier)：

 * `as`
     - 用於[型別轉換 (type cast)](typecasts.md#unsafe-cast-operator)。
     - 指定[匯入別名 (alias for an import)](packages.md#imports)。
 * `as?` 用於[安全型別轉換 (safe type cast)](typecasts.md#unsafe-cast-operator)。
 * `break` [中止迴圈 (loop) 的執行](returns.md)。
 * `class` 宣告[類別](classes.md)。
 * `continue` [繼續執行最接近的外層迴圈的下一步](returns.md)。
 * `do` 開始一個 [do/while 迴圈](control-flow.md#while-loops)（具有後置條件的迴圈）。
 * `else` 定義 [if 運算式](control-flow.md#if-expression) 中條件為 false 時執行的分支。
 * `false` 指定 [布林 (Boolean)](booleans.md) 型別的 'false' 值。
 * `for` 開始一個 [for 迴圈](control-flow.md#for-loops)。
 * `fun` 宣告[函式](functions.md)。
 * `if` 開始一個 [if 運算式](control-flow.md#if-expression)。
 * `in`
     - 指定 [for 迴圈](control-flow.md#for-loops) 中正在疊代的物件。
     - 用作中綴運算子 (infix operator)，以檢查某個值是否屬於[區間 (range)](ranges.md)、集合或其他[定義了 'contains' 方法](operator-overloading.md#in-operator)的實體。
     - 在 [when 運算式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
     - 將型別參數標記為[逆變 (contravariant)](generics.md#declaration-site-variance)。
 * `!in`
     - 用作運算子，以檢查某個值是否「不」屬於[區間 (range)](ranges.md)、集合或其他[定義了 'contains' 方法](operator-overloading.md#in-operator)的實體。
     - 在 [when 運算式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
 * `interface` 宣告[介面](interfaces.md)。
 * `is`
     - 檢查[某個值是否具有特定型別](typecasts.md#is-and-is-operators)。
     - 在 [when 運算式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
 * `!is`
     - 檢查[某個值是否「不」具有特定型別](typecasts.md#is-and-is-operators)。
     - 在 [when 運算式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
 * `null` 是一個常數，表示不指向任何物件的物件參照。
 * `object` [同時宣告一個類別及其執行個體 (instance)](object-declarations.md)。
 * `package` 指定[目前檔案的套件 (package)](packages.md)。
 * `return` [從最接近的外層函式或匿名函式中傳回](returns.md)。
 * `super`
     - [參照方法或屬性的基底類別 (superclass) 實作](inheritance.md#calling-the-superclass-implementation)。
     - [從次要建構函式呼叫基底類別建構函式](classes.md#inheritance)。
 * `this`
     - 參照[目前的接收者 (receiver)](this-expressions.md)。
     - [從次要建構函式呼叫同一個類別的另一個建構函式](classes.md#constructors-and-initializer-blocks)。
 * `throw` [拋出例外 (exception)](exceptions.md)。
 * `true` 指定 [布林 (Boolean)](booleans.md) 型別的 'true' 值。
 * `try` [開始一個例外處理區塊](exceptions.md)。
 * `typealias` 宣告[型別別名 (type alias)](type-aliases.md)。
 * `typeof` 保留供未來使用。
 * `val` 宣告唯讀[屬性](properties.md)或[區域變數](basic-syntax.md#variables)。
 * `var` 宣告可變[屬性](properties.md)或[區域變數](basic-syntax.md#variables)。
 * `when` 開始一個 [when 運算式](control-flow.md#when-expressions-and-statements)（執行給定分支之一）。
 * `while` 開始一個 [while 迴圈](control-flow.md#while-loops)（具有前置條件的迴圈）。

## 軟關鍵字 (Soft keywords)

以下標記在適用的上下文中充當關鍵字，但在其他上下文中可用作識別符號：

 * `by`
     - [將介面的實作委任 (delegate) 給另一個物件](delegation.md)。
     - [將屬性存取器 (accessor) 的實作委任給另一個物件](delegated-properties.md)。
 * `catch` 開始一個[處理特定例外型別](exceptions.md)的區塊。
 * `constructor` 宣告[主要或次要建構函式](classes.md#constructors-and-initializer-blocks)。
 * `delegate` 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
 * `dynamic` 在 Kotlin/JS 程式碼中參照 [dynamic 型別](dynamic-type.md)。
 * `field` 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
 * `file` 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
 * `finally` 開始一個[在 try 區塊結束時一律會執行](exceptions.md)的區塊。
 * `get`
     - 宣告[屬性的 getter](properties.md)。
     - 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
 * `import` [將另一個套件中的宣告匯入目前檔案](packages.md)。
 * `init` 開始一個[初始設定式區塊 (initializer block)](classes.md#constructors-and-initializer-blocks)。
 * `param` 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
 * `property` 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
 * `receiver` 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
 * `set`
     - 宣告[屬性的 setter](properties.md)。
     - 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
* `setparam` 用作[註解使用點目標 (annotation use-site target)](annotations.md#annotation-use-site-targets)。
* `value` 與 `class` 關鍵字配合使用以宣告[內聯類別 (inline class)](inline-classes.md)。
* `where` 指定[泛型型別參數的約束 (constraint)](generics.md#upper-bounds)。

## 修飾詞關鍵字 (Modifier keywords)

以下標記在宣告的修飾詞列表中充當關鍵字，但在其他上下文中可用作識別符號：

 * `abstract` 將類別或成員標記為[抽象 (abstract)](classes.md#abstract-classes)。
 * `actual` 在[多平台 (multiplatform) 專案](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)中表示平台特定實作。
 * `annotation` 宣告[註解類別 (annotation class)](annotations.md)。
 * `companion` 宣告[伴生物件 (companion object)](object-declarations.md#companion-objects)。
 * `const` 將屬性標記為[編譯期常數 (compile-time constant)](properties.md#compile-time-constants)。
 * `crossinline` 禁止[傳遞給內嵌函式的 Lambda 運算式中出現非局部傳回 (non-local returns)](inline-functions.md#returns)。
 * `data` 指示編譯器為類別[產生標準成員 (canonical members)](data-classes.md)。
 * `enum` 宣告[列舉 (enumeration)](enum-classes.md)。
 * `expect` 將宣告標記為[平台特定](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，預期在平台模組中會有實作。
 * `external` 將宣告標記為在 Kotlin 之外實作（可透過 [JNI](java-interop.md#using-jni-with-kotlin) 或在 [JavaScript](js-interop.md#external-modifier) 中存取）。
 * `final` 禁止[覆寫成員](inheritance.md#overriding-methods)。
 * `infix` 允許使用[中綴標記法 (infix notation)](functions.md#infix-notation) 呼叫函式。
 * `inline` 告知編譯器[在呼叫點內嵌 (inline) 函式以及傳遞給它的 Lambda 運算式](inline-functions.md)。
 * `inner` 允許從[巢狀類別 (nested class)](nested-classes.md) 參照外部類別執行個體。
 * `internal` 將宣告標記為[在目前模組中可見](visibility-modifiers.md)。
 * `lateinit` 允許[在建構函式之外初始化非 null 屬性](properties.md#late-initialized-properties-and-variables)。
 * `noinline` 關閉[傳遞給內嵌函式的 Lambda 運算式的內嵌功能](inline-functions.md#noinline)。
 * `open` 允許[繼承類別或覆寫成員](classes.md#inheritance)。
 * `operator` 將函式標記為[多載運算子或實作慣例 (convention)](operator-overloading.md)。
 * `out` 將型別參數標記為[共變 (covariant)](generics.md#declaration-site-variance)。
 * `override` 將成員標記為[基底類別成員的覆寫 (override)](inheritance.md#overriding-methods)。
 * `private` 將宣告標記為[在目前類別或檔案中可見](visibility-modifiers.md)。
 * `protected` 將宣告標記為[在目前類別及其子類別中可見](visibility-modifiers.md)。
 * `public` 將宣告標記為[隨處可見](visibility-modifiers.md)。
 * `reified` 將內嵌函式的型別參數標記為[在執行階段可存取](inline-functions.md#reified-type-parameters)。
 * `sealed` 宣告[密封類別 (sealed class)](sealed-classes.md)（受限制繼承的類別）。
 * `suspend` 將函式或 Lambda 標記為暫停（可作為[協同程式 (coroutine)](coroutines-overview.md) 使用）。
 * `tailrec` 將函式標記為[尾端遞迴 (tail-recursive)](functions.md#tail-recursive-functions)（允許編譯器以疊代取代遞迴）。
 * `vararg` 允許[為參數傳遞可變數量的引數 (argument)](functions.md#variable-number-of-arguments-varargs)。

## 特殊識別符號 (Special identifiers)

以下識別符號由編譯器在特定上下文中定義，但在其他上下文中可用作一般識別符號：

 * `field` 在屬性存取器內部使用，以參照該[屬性的支援欄位 (backing field)](properties.md#backing-fields)。
 * `it` 在 Lambda 運算式內部使用，以[隱式參照其參數](lambdas.md#it-implicit-name-of-a-single-parameter)。

## 運算子與特殊符號

Kotlin 支援以下運算子與特殊符號：

 * `+`, `-`, `*`, `/`, `%` - 數學運算子
     - `*` 也用於[將陣列傳遞給 vararg 參數](functions.md#variable-number-of-arguments-varargs)。
 * `=`
     - 指派 (assignment) 運算子。
     - 用於指定[參數的預設值](functions.md#parameters-with-default-values)。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [複合指派運算子 (augmented assignment operator)](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [遞增與遞減運算子](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 邏輯 'and', 'or', 'not' 運算子（對於按位 (bitwise) 運算，請改用對應的[中綴函式](numbers.md#operations-on-numbers)）。
 * `==`, `!=` - [相等運算子](operator-overloading.md#equality-and-inequality-operators)（對於非原始型別會轉換為 `equals()` 的呼叫）。
 * `===`, `!==` - [參照相等運算子 (referential equality operator)](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較運算子](operator-overloading.md#comparison-operators)（對於非原始型別會轉換為 `compareTo()` 的呼叫）。
 * `[`, `]` - [索引存取運算子](operator-overloading.md#indexed-access-operator)（轉換為 `get` 與 `set` 的呼叫）。
 * `!!` [斷言運算式為非 null](null-safety.md#not-null-assertion-operator)。
 * `?.` 執行[安全呼叫 (safe call)](null-safety.md#safe-call-operator)（若接收者為非 null 則呼叫方法或存取屬性）。
 * `?:` 若左側值為 null 則取右側值（[Elvis 運算子](null-safety.md#elvis-operator)）。
 * `::` 建立[成員參照](reflection.md#function-references)或[類別參照](reflection.md#class-references)。
 * `..`, `..<` 建立[區間 (range)](ranges.md)。
 * `:` 在宣告中分隔名稱與型別。
 * `?` 將型別標記為[可為 null (nullable)](null-safety.md#nullable-types-and-non-nullable-types)。
 * `->`
     - 分隔 [Lambda 運算式](lambdas.md#lambda-expression-syntax) 的參數與主體。
     - 在[函式型別](lambdas.md#function-types)中分隔參數與回傳型別宣告。
     - 分隔 [when 運算式](control-flow.md#when-expressions-and-statements) 分支的條件與主體。
 * `@`
     - 引入[註解](annotations.md#usage)。
     - 引入或參照[迴圈標籤 (label)](returns.md#break-and-continue-labels)。
     - 引入或參照[Lambda 標籤 (label)](returns.md#return-to-labels)。
     - 參照[來自外部作用域 (scope) 的 'this' 運算式](this-expressions.md#qualified-this)。
     - 參照[外部基底類別 (superclass)](inheritance.md#calling-the-superclass-implementation)。
 * `;` 分隔同一行中的多個陳述式。
 * `$` 參照 [字串範本 (string template)](strings.md#string-templates) 中的變數或運算式。
 * `_`
     - 在 [Lambda 運算式](lambdas.md#underscore-for-unused-variables) 中替代未使用的參數。
     - 在 [解構宣告 (destructuring declaration)](destructuring-declarations.md#underscore-for-unused-variables) 中替代未使用的參數。

有關運算子優先順序，請參閱 Kotlin 語法中的[此參考資料](https://kotlinlang.org/grammar/#expressions)。