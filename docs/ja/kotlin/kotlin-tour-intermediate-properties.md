[//]: # (title: 中級: プロパティ)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">オープンクラスと特殊なクラス</a><br />
        <img src="icon-7.svg" width="20" alt="Seventh step" /> <strong>プロパティ</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

初心者向けツアーでは、プロパティがクラスインスタンスの特性を宣言し、それにアクセスする方法としてどのように使用されるかを学びました。この章では、Kotlinでのプロパティの動作を深く掘り下げ、コード内でプロパティを使用する他の方法を探ります。

## バッキングフィールド

Kotlinでは、プロパティはデフォルトの`get()`関数と`set()`関数（プロパティアクセサーとして知られている）を持ち、それらの値の取得と変更を処理します。これらのデフォルト関数はコード上では明示的に見えませんが、コンパイラは舞台裏でプロパティアクセスを管理するためにそれらを自動的に生成します。これらのアクセサーは、実際のプロパティ値を格納するために**バッキングフィールド**を使用します。

バッキングフィールドは、以下のいずれかの条件が真の場合に存在します。

* プロパティのデフォルトの`get()`関数または`set()`関数を使用する場合。
* `field`キーワードを使用してコード内でプロパティ値にアクセスしようとする場合。

> `get()`関数と`set()`関数は、ゲッターとセッターとも呼ばれます。
>
{style="tip"}

例えば、このコードにはカスタムの`get()`関数や`set()`関数を持たない`category`プロパティがあり、そのためデフォルトの実装を使用しています。

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

内部的には、これは以下の擬似コードと同等です。

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

この例では：

* `get()`関数はフィールドからプロパティ値（`""`）を取得します。
* `set()`関数は`value`をパラメータとして受け入れ、それをフィールドに割り当てます。ここで`value`は`""`です。

バッキングフィールドへのアクセスは、無限ループを引き起こすことなく`get()`関数または`set()`関数に余分なロジックを追加したい場合に便利です。例えば、`name`プロパティを持つ`Person`クラスがあるとします。

```kotlin
class Person {
    var name: String = ""
}
```

`name`プロパティの最初の文字が大文字であることを保証したいので、[`replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html)および[`uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html)拡張関数を使用するカスタム`set()`関数を作成します。しかし、`set()`関数内でプロパティを直接参照すると、無限ループが発生し、実行時に`StackOverflowError`が発生します。

```kotlin
class Person {
    var name: String = ""
        set(value) {
            // This causes a runtime error
            name = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Exception in thread "main" java.lang.StackOverflowError
}
```
{validate ="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

これを修正するには、`field`キーワードで参照することにより、`set()`関数でバッキングフィールドを使用できます。

```kotlin
class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Kodee
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-backingfield"}

バッキングフィールドは、ロギングの追加、プロパティ値が変更されたときの通知の送信、またはプロパティの古い値と新しい値を比較する追加のロジックを使用したい場合にも便利です。

詳細については、「[バッキングフィールド](properties.md#backing-fields)」を参照してください。

## 拡張プロパティ

拡張関数と同様に、拡張プロパティも存在します。拡張プロパティを使用すると、既存のクラスのソースコードを変更することなく、新しいプロパティを追加できます。ただし、Kotlinの拡張プロパティにはバッキングフィールドが**ありません**。これは、`get()`関数と`set()`関数を自分で記述する必要があることを意味します。さらに、バッキングフィールドがないということは、状態を保持できないことを意味します。

拡張プロパティを宣言するには、拡張したいクラス名の後に`.`とプロパティ名を記述します。通常のクラスプロパティと同様に、プロパティのレシーバー型を宣言する必要があります。例えば：

```kotlin
val String.lastChar: Char
```
{validate="false"}

拡張プロパティは、継承を使用せずにプロパティに計算値を含めたい場合に最も役立ちます。拡張プロパティは、レシーバーオブジェクトという1つのパラメータを持つ関数のように機能すると考えることができます。

例えば、`firstName`と`lastName`という2つのプロパティを持つ`Person`というデータクラスがあるとします。

```kotlin
data class Person(val firstName: String, val lastName: String)
```

`Person`データクラスを変更したり、そこから継承したりすることなく、個人のフルネームにアクセスできるようにしたいとします。これを行うには、カスタム`get()`関数を持つ拡張プロパティを作成します。

```kotlin
data class Person(val firstName: String, val lastName: String)

// Extension property to get the full name
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // Use the extension property
    println(person.fullName)
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> 拡張プロパティは、クラスの既存のプロパティをオーバーライドすることはできません。
>
{style="note"}

拡張関数と同様に、Kotlin標準ライブラリは拡張プロパティを広く使用しています。例えば、`CharSequence`の[`lastIndex`プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html)を参照してください。

## 委譲プロパティ

[クラスとインターフェース](kotlin-tour-intermediate-classes-interfaces.md#delegation)の章で、委譲についてすでに学びました。プロパティでも委譲を使用して、プロパティアクセサーを別のオブジェクトに委譲できます。これは、単純なバッキングフィールドでは処理できない、データベーステーブル、ブラウザセッション、マップなどに値を格納するなど、プロパティの格納により複雑な要件がある場合に役立ちます。委譲プロパティを使用すると、プロパティの取得と設定のロジックが委譲先のオブジェクトにのみ含まれるため、ボイラープレートコードも削減されます。

構文はクラスでの委譲の使用と似ていますが、異なるレベルで動作します。プロパティを宣言し、その後に`by`キーワードと委譲先のオブジェクトを続けます。例えば：

```kotlin
val displayName: String by Delegate
```

ここでは、委譲プロパティ`displayName`は、そのプロパティアクセサーのために`Delegate`オブジェクトを参照します。

委譲するすべてのオブジェクトは、Kotlinが委譲プロパティの値を取得するために使用する`getValue()`演算子関数を**持っている必要があります**。プロパティがミュータブルな場合、Kotlinがその値を設定するために`setValue()`演算子関数も持っている必要があります。

デフォルトでは、`getValue()`関数と`setValue()`関数は以下の構造を持っています。

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

これらの関数では：

* `operator`キーワードは、これらの関数を演算子関数としてマークし、`get()`関数と`set()`関数をオーバーロードできるようにします。
* `thisRef`パラメータは、委譲プロパティを**含む**オブジェクトを参照します。デフォルトでは型は`Any?`に設定されていますが、より具体的な型を宣言する必要がある場合があります。
* `property`パラメータは、値にアクセスまたは変更されるプロパティを参照します。このパラメータを使用して、プロパティの名前や型などの情報にアクセスできます。デフォルトでは型は`Any?`に設定されています。コードでこれを変更することを心配する必要はありません。

`getValue()`関数はデフォルトで`String`の戻り値の型を持ちますが、必要に応じて調整できます。

`setValue()`関数には追加のパラメータ`value`があり、これはプロパティに割り当てられる新しい値を保持するために使用されます。

では、これは実際にはどのように見えるのでしょうか？ユーザーの表示名のように、計算コストが高くアプリケーションのパフォーマンスが重要であるため、一度だけ計算される計算済みプロパティを持ちたいとします。委譲プロパティを使用して表示名をキャッシュすることで、一度だけ計算され、パフォーマンスに影響を与えることなくいつでもアクセスできるようになります。

まず、委譲先のオブジェクトを作成する必要があります。この場合、オブジェクトは`CachedStringDelegate`クラスのインスタンスになります。

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue`プロパティにはキャッシュされた値が含まれます。`CachedStringDelegate`クラス内で、委譲プロパティの`get()`関数で必要な動作を`getValue()`演算子関数の本体に追加します。

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: Any?, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "Default Value"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}
```

`getValue()`関数は、`cachedValue`プロパティが`null`であるかどうかをチェックします。`null`の場合、関数は`"Default value"`を割り当て、ロギングのために文字列を出力します。`cachedValue`プロパティがすでに計算されている場合、プロパティは`null`ではありません。この場合、ロギングのために別の文字列が出力されます。最後に、関数はElvis演算子を使用して、キャッシュされた値、または値が`null`の場合は`"Unknown"`を返します。

これで、キャッシュしたいプロパティ（`val displayName`）を`CachedStringDelegate`クラスのインスタンスに委譲できます。

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: User, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "${thisRef.firstName} ${thisRef.lastName}"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}

class User(val firstName: String, val lastName: String) {
    val displayName: String by CachedStringDelegate()
}

fun main() {
    val user = User("John", "Doe")

    // First access computes and caches the value
    println(user.displayName)
    // Computed and cached: John Doe
    // John Doe

    // Subsequent accesses retrieve the value from cache
    println(user.displayName)
    // Accessed from cache: John Doe
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

この例では：

* ヘッダーに`firstName`と`lastName`の2つのプロパティ、クラス本体に`displayName`という1つのプロパティを持つ`User`クラスを作成します。
* `displayName`プロパティを`CachedStringDelegate`クラスのインスタンスに委譲します。
* `user`という`User`クラスのインスタンスを作成します。
* `user`インスタンス上の`displayName`プロパティにアクセスした結果を出力します。

`getValue()`関数では、`thisRef`パラメータの型が`Any?`型からオブジェクト型である`User`に絞り込まれていることに注意してください。これは、コンパイラが`User`クラスの`firstName`プロパティと`lastName`プロパティにアクセスできるようにするためです。

### 標準デリゲート

Kotlin標準ライブラリは、常に最初から独自のデリゲートを作成する必要がないように、いくつかの便利なデリゲートを提供しています。これらのデリゲートのいずれかを使用する場合、標準ライブラリが自動的に`getValue()`関数と`setValue()`関数を提供するため、それらを定義する必要はありません。

#### 遅延プロパティ

プロパティが最初にアクセスされたときにのみ初期化するには、遅延プロパティを使用します。標準ライブラリは、委譲のために`Lazy`インターフェースを提供しています。

`Lazy`インターフェースのインスタンスを作成するには、`lazy()`関数を呼び出す際に、`get()`関数が最初に呼び出されたときに実行されるラムダ式を指定します。それ以降の`get()`関数の呼び出しでは、最初の呼び出しで提供されたものと同じ結果が返されます。遅延プロパティは、ラムダ式を渡すために[末尾ラムダ](kotlin-tour-functions.md#trailing-lambdas)構文を使用します。

例えば：

```kotlin
class Database {
    fun connect() {
        println("Connecting to the database...")
    }

    fun query(sql: String): List<String> {
        return listOf("Data1", "Data2", "Data3")
    }
}

val databaseConnection: Database by lazy {
    val db = Database()
    db.connect()
    db
}

fun fetchData() {
    val data = databaseConnection.query("SELECT * FROM data")
    println("Data: $data")
}

fun main() {
    // First time accessing databaseConnection
    fetchData()
    // Connecting to the database...
    // Data: [Data1, Data2, Data3]

    // Subsequent access uses the existing connection
    fetchData()
    // Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

この例では：

* `connect()`および`query()`メンバ関数を持つ`Database`クラスがあります。
* `connect()`関数はコンソールに文字列を出力し、`query()`関数はSQLクエリを受け取ってリストを返します。
* 遅延プロパティである`databaseConnection`プロパティがあります。
* `lazy()`関数に提供されるラムダ式は次のとおりです：
  * `Database`クラスのインスタンスを作成します。
  * このインスタンス（`db`）で`connect()`メンバ関数を呼び出します。
  * インスタンスを返します。
* `fetchData()`関数は次のとおりです：
  * `databaseConnection`プロパティに対して`query()`関数を呼び出すことでSQLクエリを作成します。
  * SQLクエリを`data`変数に割り当てます。
  * `data`変数をコンソールに出力します。
* `main()`関数は`fetchData()`関数を呼び出します。最初に呼び出されたとき、遅延プロパティが初期化されます。2回目以降は、最初の呼び出しと同じ結果が返されます。

遅延プロパティは、初期化がリソース集約型である場合だけでなく、プロパティがコードで使用されない可能性のある場合にも役立ちます。さらに、遅延プロパティはデフォルトでスレッドセーフであり、これは並行環境で作業している場合に特に有利です。

詳細については、「[遅延プロパティ](delegated-properties.md#lazy-properties)」を参照してください。

#### 可観測プロパティ

プロパティの値が変更されたかどうかを監視するには、可観測プロパティを使用します。可観測プロパティは、プロパティ値の変更を検出し、この情報を使用して反応をトリガーしたい場合に役立ちます。標準ライブラリは、委譲のために`Delegates`オブジェクトを提供しています。

可観測プロパティを作成するには、まず`kotlin.properties.Delegates.observable`をインポートする必要があります。次に、`observable()`関数を使用し、プロパティが変更されるたびに実行されるラムダ式を指定します。遅延プロパティと同様に、可観測プロパティはラムダ式を渡すために[末尾ラムダ](kotlin-tour-functions.md#trailing-lambdas)構文を使用します。

例えば：

```kotlin
import kotlin.properties.Delegates.observable

class Thermostat {
    var temperature: Double by observable(20.0) { _, old, new ->
        if (new > 25) {
            println("Warning: Temperature is too high! ($old°C -> $new°C)")
        } else {
            println("Temperature updated: $old°C -> $new°C")
        }
    }
}

fun main() {
    val thermostat = Thermostat()
    thermostat.temperature = 22.5
    // Temperature updated: 20.0°C -> 22.5°C

    thermostat.temperature = 27.0
    // Warning: Temperature is too high! (22.5°C -> 27.0°C)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-observable"}

この例では：

* 可観測プロパティである`temperature`を含む`Thermostat`クラスがあります。
* `observable()`関数はパラメータとして`20.0`を受け入れ、それを使用してプロパティを初期化します。
* `observable()`関数に提供されるラムダ式は次のとおりです：
  * 3つのパラメータを持ちます：
    * `_`：プロパティ自体を参照します。
    * `old`：プロパティの古い値です。
    * `new`：プロパティの新しい値です。
  * `new`パラメータが`25`より大きいかどうかをチェックし、結果に応じて文字列をコンソールに出力します。
* `main()`関数は次のとおりです：
  * `thermostat`という`Thermostat`クラスのインスタンスを作成します。
  * インスタンスの`temperature`プロパティの値を`22.5`に更新します。これにより、温度更新を伴うprint文がトリガーされます。
  * インスタンスの`temperature`プロパティの値を`27.0`に更新します。これにより、警告を伴うprint文がトリガーされます。

可観測プロパティは、ロギングやデバッグ目的だけでなく、UIの更新やデータの有効性の検証などの追加チェックを実行するユースケースにも役立ちます。

詳細については、「[可観測プロパティ](delegated-properties.md#observable-properties)」を参照してください。

## 演習

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

あなたは書店の在庫管理システムを管理しています。在庫はリストに保存されており、各項目は特定の本の数量を表しています。例えば、`listOf(3, 0, 7, 12)`は、店に最初の本が3冊、2番目の本が0冊、3番目の本が7冊、4番目の本が12冊あることを意味します。

在庫切れの本すべてのインデックスのリストを返す`findOutOfStockBooks()`という関数を記述してください。

<deflist collapsible="true">
    <def title="ヒント1">
        標準ライブラリの[`indices`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html)拡張プロパティを使用してください。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="ヒント2">
        手動で可変リストを作成して返す代わりに、[`buildList()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html)関数を使用してリストを作成および管理できます。`buildList()`関数は、以前の章で学んだレシーバー付きラムダを使用します。
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // Write your code here
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    val outOfStockIndices = mutableListOf<Int>()
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            outOfStockIndices.add(index)
        }
    }
    return outOfStockIndices
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例1" id="kotlin-tour-properties-solution-1-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> = buildList {
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            add(index)
        }
    }
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例2" id="kotlin-tour-properties-solution-1-2"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

あなたは、距離をキロメートルとマイルの両方で表示する必要がある旅行アプリを持っています。キロメートルでの距離をマイルに変換するために、`Double`型に`asMiles`という拡張プロパティを作成してください。

> キロメートルをマイルに変換する式は、`miles = kilometers * 0.621371`です。
>
{style="note"}

<deflist collapsible="true">
    <def title="ヒント">
        拡張プロパティにはカスタム`get()`関数が必要であることを覚えておいてください。
    </def>
</deflist>

|---|---|

```kotlin
val // Write your code here

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-2"}

|---|---|
```kotlin
val Double.asMiles: Double
    get() = this * 0.621371

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-properties-solution-2"}

### 演習3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

あなたはクラウドシステムの状態を判断できるシステムヘルスチェッカーを持っています。しかし、ヘルスチェックを実行できる2つの関数はパフォーマンス集約型です。負荷の高い関数が必要なときにのみ実行されるように、遅延プロパティを使用してチェックを初期化してください。

|---|---|

```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    // Write your code here

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
    // Performing application server health check...
    // Application server is online and healthy
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-3"}

|---|---|
```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    val isAppServerHealthy by lazy { checkAppServer() }
    val isDatabaseHealthy by lazy { checkDatabase() }

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
   // Performing application server health check...
   // Application server is online and healthy
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-properties-solution-3"}

### 演習4 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

あなたはシンプルな予算追跡アプリを構築しています。このアプリは、ユーザーの残りの予算の変更を監視し、特定のしきい値を下回るたびにユーザーに通知する必要があります。あなたは、初期予算額を含む`totalBudget`プロパティで初期化される`Budget`クラスを持っています。クラス内に、`remainingBudget`という可観測プロパティを作成し、以下を出力するようにしてください：

* 値が初期予算の20%未満の場合に警告。
* 予算が前の値から増加した場合に励ましのメッセージ。

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // Write your code here
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    // Warning: Your remaining budget (150) is below 20% of your total budget.
    myBudget.remainingBudget = 50
    // Warning: Your remaining budget (50) is below 20% of your total budget.
    myBudget.remainingBudget = 300
    // Good news: Your remaining budget increased to 300.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-4"}

|---|---|
```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
  var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue ->
    if (newValue < totalBudget * 0.2) {
      println("Warning: Your remaining budget ($newValue) is below 20% of your total budget.")
    } else if (newValue > oldValue) {
      println("Good news: Your remaining budget increased to $newValue.")
    }
  }
}

fun main() {
  val myBudget = Budget(totalBudget = 1000)
  myBudget.remainingBudget = 800
  myBudget.remainingBudget = 150
  // Warning: Your remaining budget (150) is below 20% of your total budget.
  myBudget.remainingBudget = 50
  // Warning: Your remaining budget (50) is below 20% of your total budget.
  myBudget.remainingBudget = 300
  // Good news: Your remaining budget increased to 300.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-properties-solution-4"}

## 次のステップ

[中級: Null安全性](kotlin-tour-intermediate-null-safety.md)