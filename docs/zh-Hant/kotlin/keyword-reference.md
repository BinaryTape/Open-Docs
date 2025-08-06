[//]: # (title: 關鍵字與運算子)

## 硬關鍵字

以下標記總是會被解釋為關鍵字，並且不能用作識別符號：

 * `as`
     - 用於[型別轉換](typecasts.md#unsafe-cast-operator)。
     - 為[匯入](packages.md#imports)指定別名
 * `as?` 用於[安全型別轉換](typecasts.md#safe-nullable-cast-operator)。
 * `break` [終止迴圈的執行](returns.md)。
 * `class` 宣告一個[類別](classes.md)。
 * `continue` [跳到最近封閉迴圈的下一個步驟](returns.md)。
 * `do` 開始一個 [do/while 迴圈](control-flow.md#while-loops)（帶有後置條件的迴圈）。
 * `else` 定義當條件為假時執行的[if 表達式](control-flow.md#if-expression)分支。
 * `false` 指定[Boolean 型別](booleans.md)的 'false' 值。
 * `for` 開始一個 [for 迴圈](control-flow.md#for-loops)。
 * `fun` 宣告一個[函式](functions.md)。
 * `if` 開始一個 [if 表達式](control-flow.md#if-expression)。
 * `in`
     - 在[for 迴圈](control-flow.md#for-loops)中指定正在迭代的物件。
     - 作為中綴運算子用於檢查值是否屬於[一個範圍](ranges.md)、一個集合或[定義了 'contains' 方法](operator-overloading.md#in-operator)的其他實體。
     - 在[when 表達式](control-flow.md#when-expressions-and-statements)中用於相同的目的。
     - 將型別參數標記為[逆變](generics.md#declaration-site-variance)。
 * `!in`
     - 作為運算子用於檢查值是否**不**屬於[一個範圍](ranges.md)、一個集合或[定義了 'contains' 方法](operator-overloading.md#in-operator)的其他實體。
     - 在[when 表達式](control-flow.md#when-expressions-and-statements)中用於相同的目的。
 * `interface` 宣告一個[介面](interfaces.md)。
 * `is`
     - 檢查[一個值是否具有特定型別](typecasts.md#is-and-is-operators)。
     - 在[when 表達式](control-flow.md#when-expressions-and-statements)中用於相同的目的。
 * `!is`
     - 檢查[一個值是否**不**具有特定型別](typecasts.md#is-and-is-operators)。
     - 在[when 表達式](control-flow.md#when-expressions-and-statements)中用於相同的目的。
 * `null` 是一個表示不指向任何物件的物件參照常數。
 * `object` 同時宣告[一個類別及其實例](object-declarations.md)。
 * `package` 指定[當前檔案的套件](packages.md)。
 * `return` [從最近的封閉函式或匿名函式返回](returns.md)。
 * `super`
     - [參照超類別方法或屬性的實作](inheritance.md#calling-the-superclass-implementation)。
     - 從次要建構函式[呼叫超類別建構函式](classes.md#inheritance)。
 * `this`
     - 參照[當前的接收者](this-expressions.md)。
     - 從次要建構函式[呼叫同一類別的另一個建構函式](classes.md#constructors)。
 * `throw` [拋出一個例外](exceptions.md)。
 * `true` 指定[Boolean 型別](booleans.md)的 'true' 值。
 * `try` [開始一個例外處理區塊](exceptions.md)。
 * `typealias` 宣告一個[型別別名](type-aliases.md)。
 * `typeof` 保留供將來使用。
 * `val` 宣告一個唯讀[屬性](properties.md)或[區域變數](basic-syntax.md#variables)。
 * `var` 宣告一個可變[屬性](properties.md)或[區域變數](basic-syntax.md#variables)。
 * `when` 開始一個 [when 表達式](control-flow.md#when-expressions-and-statements)（執行給定分支之一）。
 * `while` 開始一個 [while 迴圈](control-flow.md#while-loops)（帶有前置條件的迴圈）。

## 軟關鍵字

以下標記在適用上下文中充當關鍵字，並且在其他上下文中可以用作識別符號：

 * `by`
     - [將介面的實作委派給另一個物件](delegation.md)。
     - [將屬性存取器的實作委派給另一個物件](delegated-properties.md)。
 * `catch` 開始一個[處理特定例外型別](exceptions.md)的區塊。
 * `constructor` 宣告一個[主要或次要建構函式](classes.md#constructors)。
 * `delegate` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `dynamic` 在 Kotlin/JS 程式碼中參照一個[動態型別](dynamic-type.md)。
 * `field` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `file` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `finally` 開始一個[在 try 區塊退出時總是會執行](exceptions.md)的區塊。
 * `get`
     - 宣告[屬性的 getter](properties.md#getters-and-setters)。
     - 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `import` [將另一個套件中的宣告匯入到當前檔案](packages.md)。
 * `init` 開始一個[初始化器區塊](classes.md#constructors)。
 * `param` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `property` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `receiver` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
 * `set`
     - 宣告[屬性的 setter](properties.md#getters-and-setters)。
     - 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
* `setparam` 用作[註解使用站點目標](annotations.md#annotation-use-site-targets)。
* `value` 與 `class` 關鍵字一同宣告[行內類別](inline-classes.md)。
* `where` 指定[泛型型別參數的約束](generics.md#upper-bounds)。

## 修飾符關鍵字

以下標記在宣告的修飾符列表中充當關鍵字，並且在其他上下文中可以用作識別符號：

 * `abstract` 將類別或成員標記為[抽象的](classes.md#abstract-classes)。
 * `actual` 在[多平台專案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)中表示平台特定的實作。
 * `annotation` 宣告一個[註解類別](annotations.md)。
 * `companion` 宣告一個[伴生物件](object-declarations.md#companion-objects)。
 * `const` 將屬性標記為[編譯期常數](properties.md#compile-time-constants)。
 * `crossinline` 禁止[傳遞給行內函式的 Lambda 中進行非區域返回](inline-functions.md#returns)。
 * `data` 指示編譯器為[類別生成規範成員](data-classes.md)。
 * `enum` 宣告一個[列舉](enum-classes.md)。
 * `expect` 將宣告標記為[平台特定](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，預期在平台模組中實作。
 * `external` 將宣告標記為在 Kotlin 外部實作（可透過 [JNI](java-interop.md#using-jni-with-kotlin) 或在 [JavaScript](js-interop.md#external-modifier) 中存取）。
 * `final` 禁止[覆寫成員](inheritance.md#overriding-methods)。
 * `infix` 允許使用[中綴表示法](functions.md#infix-notation)呼叫函式。
 * `inline` 告知編譯器在[呼叫站點行內化函式及傳遞給它的 Lambda](inline-functions.md)。
 * `inner` 允許從[巢狀類別](nested-classes.md)參照外部類別實例。
 * `internal` 將宣告標記為在[當前模組中可見](visibility-modifiers.md)。
 * `lateinit` 允許在建構函式之外初始化[不可為 null 的屬性](properties.md#late-initialized-properties-and-variables)。
 * `noinline` 關閉[傳遞給行內函式的 Lambda 的行內化](inline-functions.md#noinline)。
 * `open` 允許[繼承類別或覆寫成員](classes.md#inheritance)。
 * `operator` 將函式標記為[運算子多載或實作約定](operator-overloading.md)。
 * `out` 將型別參數標記為[共變](generics.md#declaration-site-variance)。
 * `override` 將成員標記為[超類別成員的覆寫](inheritance.md#overriding-methods)。
 * `private` 將宣告標記為在[當前類別或檔案中可見](visibility-modifiers.md)。
 * `protected` 將宣告標記為在[當前類別及其子類別中可見](visibility-modifiers.md)。
 * `public` 將宣告標記為[在任何地方都可見](visibility-modifiers.md)。
 * `reified` 將行內函式的型別參數標記為[執行時可存取](inline-functions.md#reified-type-parameters)。
 * `sealed` 宣告一個[密封類別](sealed-classes.md)（一個子類化受限制的類別）。
 * `suspend` 將函式或 Lambda 標記為暫停（可用作[協程](coroutines-overview.md)）。
 * `tailrec` 將函式標記為[尾遞迴](functions.md#tail-recursive-functions)（允許編譯器用迭代替換遞迴）。
 * `vararg` 允許[為參數傳遞可變數量的引數](functions.md#variable-number-of-arguments-varargs)。

## 特殊識別符號

以下識別符號由編譯器在特定上下文中定義，並且在其他上下文中可以用作常規識別符號：

 * `field` 在屬性存取器內部用於參照[屬性的支援欄位](properties.md#backing-fields)。
 * `it` 在 Lambda 內部用於[隱式參照其參數](lambdas.md#it-implicit-name-of-a-single-parameter)。

## 運算子與特殊符號

Kotlin 支援以下運算子與特殊符號：

 * `+`, `-`, `*`, `/`, `%` - 數學運算子
     - `*` 也用於[將陣列傳遞給 vararg 參數](functions.md#variable-number-of-arguments-varargs)。
 * `=`
     - 指派運算子。
     - 用於指定[參數的預設值](functions.md#parameters-with-default-values)。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [擴增指派運算子](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [遞增和遞減運算子](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 邏輯 'and'、'or'、'not' 運算子（對於位元運算，請改用相對應的[中綴函式](numbers.md#operations-on-numbers)）。
 * `==`, `!=` - [相等運算子](operator-overloading.md#equality-and-inequality-operators)（對於非基本型別，翻譯為呼叫 `equals()`）。
 * `===`, `!==` - [參照相等運算子](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較運算子](operator-overloading.md#comparison-operators)（對於非基本型別，翻譯為呼叫 `compareTo()`）。
 * `[`, `]` - [索引存取運算子](operator-overloading.md#indexed-access-operator)（翻譯為呼叫 `get` 和 `set`）。
 * `!!` [斷言一個表達式不可為 null](null-safety.md#not-null-assertion-operator)。
 * `?.` 執行[安全呼叫](null-safety.md#safe-call-operator)（如果接收者不可為 null，則呼叫方法或存取屬性）。
 * `?:` 如果左側值為 null 則取右側值（[elvis 運算子](null-safety.md#elvis-operator)）。
 * `::` 建立[成員參照](reflection.md#function-references)或[類別參照](reflection.md#class-references)。
 * `..`, `..<` 建立[範圍](ranges.md)。
 * `:` 在宣告中將名稱與型別分開。
 * `?` 將型別標記為[可為 null 的](null-safety.md#nullable-types-and-non-nullable-types)。
 * `->`
     - 分隔[Lambda 表達式](lambdas.md#lambda-expression-syntax)的參數與主體。
     - 分隔[函式型別](lambdas.md#function-types)的參數與回傳型別宣告。
     - 分隔[when 表達式](control-flow.md#when-expressions-and-statements)分支的條件與主體。
 * `@`
     - 引入一個[註解](annotations.md#usage)。
     - 引入或參照一個[迴圈標籤](returns.md#break-and-continue-labels)。
     - 引入或參照一個[Lambda 標籤](returns.md#return-to-labels)。
     - 參照[外部範圍的 'this' 表達式](this-expressions.md#qualified-this)。
     - 參照[外部超類別](inheritance.md#calling-the-superclass-implementation)。
 * `;` 分隔同一行上的多個語句。
 * `$` 在[字串模板](strings.md#string-templates)中參照變數或表達式。
 * `_`
     - 在[Lambda 表達式](lambdas.md#underscore-for-unused-variables)中替換未使用的參數。
     - 在[解構宣告](destructuring-declarations.md#underscore-for-unused-variables)中替換未使用的參數。

對於運算子優先順序，請參閱 Kotlin 文法中[此參照](https://kotlinlang.org/docs/reference/grammar.html#expressions)。