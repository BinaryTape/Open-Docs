[//]: # (title: 關鍵字與運算子)

## 硬關鍵字

以下符號總是會被解釋為關鍵字，並且不能作為識別碼使用：

 * `as`
     - 用於[型別轉換](typecasts.md#unsafe-cast-operator)。
     - 指定[匯入的別名](packages.md#imports)。
 * `as?` 用於[安全型別轉換](typecasts.md#safe-nullable-cast-operator)。
 * `break` [終止迴圈的執行](returns.md)。
 * `class` 宣告一個[類別](classes.md)。
 * `continue` [跳到最近外圍迴圈的下一步](returns.md)。
 * `do` 開始一個 [do/while 迴圈](control-flow.md#while-loops)（一個帶有後置條件的迴圈）。
 * `else` 定義當條件為 `false` 時執行的 [if 表達式](control-flow.md#if-expression) 的分支。
 * `false` 指定 [Boolean 型別](booleans.md) 的「false」值。
 * `for` 開始一個 [for 迴圈](control-flow.md#for-loops)。
 * `fun` 宣告一個[函式](functions.md)。
 * `if` 開始一個 [if 表達式](control-flow.md#if-expression)。
 * `in`
     - 指定 [for 迴圈](control-flow.md#for-loops) 中被迭代的物件。
     - 用作中綴運算子，檢查一個值是否屬於[範圍](ranges.md)、集合，或任何[定義 'contains' 方法](operator-overloading.md#in-operator) 的其他實體。
     - 在 [when 表達式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
     - 將型別參數標記為[逆變](generics.md#declaration-site-variance)。
 * `!in`
     - 用作運算子，檢查一個值是否**不**屬於[範圍](ranges.md)、集合，或任何[定義 'contains' 方法](operator-overloading.md#in-operator) 的其他實體。
     - 在 [when 表達式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
 * `interface` 宣告一個[介面](interfaces.md)。
 * `is`
     - 檢查[一個值是否具有特定型別](typecasts.md#is-and-is-operators)。
     - 在 [when 表達式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
 * `!is`
     - 檢查[一個值是否不具有特定型別](typecasts.md#is-and-is-operators)。
     - 在 [when 表達式](control-flow.md#when-expressions-and-statements) 中用於相同目的。
 * `null` 一個常數，表示不指向任何物件的物件參考。
 * `object` 同時宣告[一個類別及其實例](object-declarations.md)。
 * `package` 指定[當前檔案的套件](packages.md)。
 * `return` [從最近的外圍函式或匿名函式中返回](returns.md)。
 * `super`
     - [指向方法或屬性的父類別實作](inheritance.md#calling-the-superclass-implementation)。
     - [從次要建構函式呼叫父類別建構函式](classes.md#inheritance)。
 * `this`
     - 指向[當前接收者](this-expressions.md)。
     - [從次要建構函式呼叫同一類別的另一個建構函式](classes.md#constructors)。
 * `throw` [丟擲一個例外](exceptions.md)。
 * `true` 指定 [Boolean 型別](booleans.md) 的「true」值。
 * `try` [開始一個例外處理區塊](exceptions.md)。
 * `typealias` 宣告一個[型別別名](type-aliases.md)。
 * `typeof` 保留供未來使用。
 * `val` 宣告一個唯讀[屬性](properties.md)或[區域變數](basic-syntax.md#variables)。
 * `var` 宣告一個可變[屬性](properties.md)或[區域變數](basic-syntax.md#variables)。
 * `when` 開始一個 [when 表達式](control-flow.md#when-expressions-and-statements)（執行其中一個給定的分支）。
 * `while` 開始一個 [while 迴圈](control-flow.md#while-loops)（一個帶有前置條件的迴圈）。

## 軟關鍵字

以下符號在適用情境下作為關鍵字，但在其他情境下可用作識別碼：

 * `by`
     - [將介面的實作委託給另一個物件](delegation.md)。
     - [將屬性存取器的實作委託給另一個物件](delegated-properties.md)。
 * `catch` 開始一個區塊，[處理特定例外型別](exceptions.md)。
 * `constructor` 宣告[主要或次要建構函式](classes.md#constructors)。
 * `delegate` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `dynamic` 在 Kotlin/JS 程式碼中參考[動態型別](dynamic-type.md)。
 * `field` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `file` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `finally` 開始一個區塊，[在 `try` 區塊結束時總是會被執行](exceptions.md)。
 * `get`
     - 宣告[屬性的 getter](properties.md#getters-and-setters)。
     - 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `import` [將宣告從另一個套件匯入當前檔案](packages.md)。
 * `init` 開始一個[初始化器區塊](classes.md#constructors)。
 * `param` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `property` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `receiver` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `set`
     - 宣告[屬性的 setter](properties.md#getters-and-setters)。
     - 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
* `setparam` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
* `value` 與 `class` 關鍵字一起使用，宣告一個[內聯類別](inline-classes.md)。
* `where` 指定[泛型型別參數的約束](generics.md#upper-bounds)。

## 修飾符關鍵字

以下符號在宣告的修飾符列表中作為關鍵字，但在其他情境下可用作識別碼：

 * `abstract` 將類別或成員標記為[抽象](classes.md#abstract-classes)。
 * `actual` 在[多平台專案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)中表示平台特定實作。
 * `annotation` 宣告一個[註解類別](annotations.md)。
 * `companion` 宣告一個[伴生物件](object-declarations.md#companion-objects)。
 * `const` 將屬性標記為[編譯時期常數](properties.md#compile-time-constants)。
 * `crossinline` 禁止在傳遞給內聯函式的 lambda 中進行[非局部返回](inline-functions.md#returns)。
 * `data` 指示編譯器[為類別生成標準成員](data-classes.md)。
 * `enum` 宣告一個[列舉](enum-classes.md)。
 * `expect` 將宣告標記為[平台特定](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，預期在平台模組中會有實作。
 * `external` 將宣告標記為在 Kotlin 之外實作（可透過 [JNI](java-interop.md#using-jni-with-kotlin) 或在 [JavaScript](js-interop.md#external-modifier) 中存取）。
 * `final` 禁止[覆寫成員](inheritance.md#overriding-methods)。
 * `infix` 允許使用[中綴表示法](functions.md#infix-notation)呼叫函式。
 * `inline` 指示編譯器在呼叫點[內聯函式及其傳遞的 lambdas](inline-functions.md)。
 * `inner` 允許從[巢狀類別](nested-classes.md)中參考外部類別實例。
 * `internal` 將宣告標記為[在當前模組中可見](visibility-modifiers.md)。
 * `lateinit` 允許在建構函式之外[初始化一個非空屬性](properties.md#late-initialized-properties-and-variables)。
 * `noinline` 關閉傳遞給內聯函式的 lambda 的[內聯](inline-functions.md#noinline)。
 * `open` 允許[子類化一個類別或覆寫一個成員](classes.md#inheritance)。
 * `operator` 將函式標記為[運算子多載或實作慣例](operator-overloading.md)。
 * `out` 將型別參數標記為[協變](generics.md#declaration-site-variance)。
 * `override` 將成員標記為[父類別成員的覆寫](inheritance.md#overriding-methods)。
 * `private` 將宣告標記為[在當前類別或檔案中可見](visibility-modifiers.md)。
 * `protected` 將宣告標記為[在當前類別及其子類別中可見](visibility-modifiers.md)。
 * `public` 將宣告標記為[在任何地方都可見](visibility-modifiers.md)。
 * `reified` 將內聯函式的型別參數標記為[執行時期可存取](inline-functions.md#reified-type-parameters)。
 * `sealed` 宣告一個[密封類別](sealed-classes.md)（一個具有受限子類化的類別）。
 * `suspend` 將函式或 lambda 標記為 suspend（可作為[協程](coroutines-overview.md)使用）。
 * `tailrec` 將函式標記為[尾遞歸](functions.md#tail-recursive-functions)（允許編譯器用迭代替換遞歸）。
 * `vararg` 允許[為參數傳遞可變數量的引數](functions.md#variable-number-of-arguments-varargs)。

## 特殊識別碼

以下識別碼由編譯器在特定情境中定義，並可在其他情境中用作常規識別碼：

 * `field` 在屬性存取器內部使用，以參考[屬性的支援欄位](properties.md#backing-fields)。
 * `it` 在 lambda 內部使用，以[隱式參考其參數](lambdas.md#it-implicit-name-of-a-single-parameter)。

## 運算子與特殊符號

Kotlin 支援以下運算子與特殊符號：

 * `+`, `-`, `*`, `/`, `%` - 數學運算子
     - `*` 也用於[將陣列傳遞給 `vararg` 參數](functions.md#variable-number-of-arguments-varargs)。
 * `=`
     - 賦值運算子。
     - 用於指定[參數的預設值](functions.md#default-arguments)。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [複合賦值運算子](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [遞增和遞減運算子](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 邏輯「與」、「或」、「非」運算子（對於位元運算，請改用相應的[中綴函式](numbers.md#operations-on-numbers)）。
 * `==`, `!=` - [相等運算子](operator-overloading.md#equality-and-inequality-operators)（對於非原始型別，會轉換為 `equals()` 的呼叫）。
 * `===`, `!==` - [引用相等運算子](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較運算子](operator-overloading.md#comparison-operators)（對於非原始型別，會轉換為 `compareTo()` 的呼叫）。
 * `[`, `]` - [索引存取運算子](operator-overloading.md#indexed-access-operator)（會轉換為 `get` 和 `set` 的呼叫）。
 * `!!` [斷言表達式為非空](null-safety.md#not-null-assertion-operator)。
 * `?.` 執行[安全呼叫](null-safety.md#safe-call-operator)（如果接收者非空，則呼叫方法或存取屬性）。
 * `?:` 如果左側值為空，則取右側值（[Elvis 運算子](null-safety.md#elvis-operator)）。
 * `::` 建立[成員參考](reflection.md#function-references)或[類別參考](reflection.md#class-references)。
 * `..`, `..<` 建立[範圍](ranges.md)。
 * `:` 在宣告中，將名稱與型別分開。
 * `?` 將型別標記為[可空](null-safety.md#nullable-types-and-non-nullable-types)。
 * `->`
     - 將[lambda 表達式](lambdas.md#lambda-expression-syntax)的參數與主體分開。
     - 在[函式型別](lambdas.md#function-types)中，將參數與返回型別宣告分開。
     - 將 [when 表達式](control-flow.md#when-expressions-and-statements) 分支的條件與主體分開。
 * `@`
     - 引入[註解](annotations.md#usage)。
     - 引入或參考[迴圈標籤](returns.md#break-and-continue-labels)。
     - 引入或參考[lambda 標籤](returns.md#return-to-labels)。
     - 參考[來自外部範圍的 'this' 表達式](this-expressions.md#qualified-this)。
     - 參考[外部父類別](inheritance.md#calling-the-superclass-implementation)。
 * `;` 分隔同一行上的多個語句。
 * `#` 在[字串樣板](strings.md#string-templates)中參考變數或表達式。
 * `_`
     - 替代[lambda 表達式](lambdas.md#underscore-for-unused-variables)中未使用的參數。
     - 替代[解構宣告](destructuring-declarations.md#underscore-for-unused-variables)中未使用的參數。

有關運算子優先順序，請參閱 Kotlin 語法中的[此參考](https://kotlinlang.org/docs/reference/grammar.html#expressions)。