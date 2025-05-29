[//]: # (title: 中級: プロパティ)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバーを持つラムダ式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">`open`クラスと特殊なクラス</a><br />
        <img src="icon-7.svg" width="20" alt="Seventh step" /> <strong>プロパティ</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

初級ツアーでは、プロパティがクラスインスタンスの特性を宣言するためにどのように使用され、それらにアクセスする方法について学びました。この章では、Kotlinでのプロパティの仕組みをさらに深く掘り下げ、コードでそれらを使用する他の方法を探ります。

## バッキングフィールド

Kotlinでは、プロパティにはデフォルトの`get()`関数と`set()`関数があり、これらはプロパティアクセサーとして知られ、値の取得と変更を扱います。これらのデフォルト関数はコード内で明示的に表示されませんが、コンパイラはプロパティへのアクセスをバックグラウンドで管理するために自動的にそれらを生成します。これらのアクセサーは、実際のプロパティ値を格納するために**バッキングフィールド**を使用します。

バッキングフィールドは、以下のいずれかの条件が真の場合に存在します。

*   そのプロパティにデフォルトの`get()`または`set()`関数を使用する場合。
*   コード内で`field`キーワードを使用してプロパティ値にアクセスしようとする場合。

> `get()`関数と`set()`関数は、ゲッターとセッターとも呼ばれます。
>
{style="tip"}

例えば、このコードにはカスタムの`get()`関数や`set()`関数を持たず、したがってデフォルトの実装を使用する`category`プロパティがあります。

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

内部的には、これはこの擬似コードに相当します。

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

*   `get()`関数はフィールドからプロパティ値`""`を取得します。
*   `set()`関数は`value`をパラメータとして受け取り、それをフィールドに割り当てます。ここで`value`は`""`です。

バッキングフィールドへのアクセスは、無限ループを引き起こすことなく、`get()`関数または`set()`関数に追加のロジックを追加したい場合に役立ちます。例えば、`name`プロパティを持つ`Person`クラスがあるとします。

```kotlin
class Person {
    var name: String = ""
}
```

`name`プロパティの最初の文字が大文字であることを保証したいとします。そこで、[`.replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html)と[`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html)拡張関数を使用するカスタム`set()`関数を作成します。しかし、`set()`関数内でプロパティを直接参照すると、無限ループが発生し、実行時に`StackOverflowError`が発生します。

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

これを修正するには、`field`キーワードで参照することにより、代わりに`set()`関数でバッキングフィールドを使用できます。

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

バッキングフィールドは、ロギングを追加したり、プロパティ値が変更されたときに通知を送信したり、古いプロパティ値と新しいプロパティ値を比較する追加のロジックを使用したりする場合にも役立ちます。

詳細については、「[バッキングフィールド](properties.md#backing-fields)」を参照してください。

## 拡張プロパティ

拡張関数と同様に、拡張プロパティもあります。拡張プロパティを使用すると、既存のクラスのソースコードを変更することなく、新しいプロパティを追加できます。しかし、Kotlinの拡張プロパティはバッキングフィールドを**持ちません**。これは、`get()`関数と`set()`関数を自分で記述する必要があることを意味します。さらに、バッキングフィールドがないということは、状態を保持できないことを意味します。

拡張プロパティを宣言するには、拡張したいクラス名に続けて`.`とプロパティ名を記述します。通常のクラスプロパティと同様に、プロパティのレシーバー型を宣言する必要があります。例えば：

```kotlin
val String.lastChar: Char
```
{validate="false"}

拡張プロパティは、継承を使用せずに、プロパティに計算された値を含ませたい場合に最も役立ちます。拡張プロパティは、レシーバーオブジェクトという1つのパラメータのみを持つ関数のように機能すると考えることができます。

例えば、`firstName`と`lastName`という2つのプロパティを持つ`Person`というデータクラスがあるとします。

```kotlin
data class Person(val firstName: String, val lastName: String)
```

`Person`データクラスを変更したり、そこから継承したりすることなく、人のフルネームにアクセスできるようにしたいとします。これを行うには、カスタム`get()`関数を持つ拡張プロパティを作成します。

```kotlin
data class Person(val firstName: String, val lastName: String)

// フルネームを取得するための拡張プロパティ
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // 拡張プロパティを使用する
    println(person.fullName)
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> 拡張プロパティは、クラスの既存のプロパティをオーバーライドできません。
> 
{style="note"}

拡張関数と同様に、Kotlin標準ライブラリは拡張プロパティを幅広く使用しています。例えば、`CharSequence`の[`lastIndex`プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html)を参照してください。

## 委譲プロパティ

[クラスとインターフェース](kotlin-tour-intermediate-classes-interfaces.md#delegation)の章で、委譲についてすでに学びました。プロパティでも委譲を使用でき、そのプロパティアクセサーを別のオブジェクトに委譲できます。これは、データベーステーブル、ブラウザセッション、マップなどに値を格納するなど、単純なバッキングフィールドでは処理できない複雑なプロパティの格納要件がある場合に役立ちます。委譲プロパティを使用すると、プロパティの取得と設定のロジックが委譲先のオブジェクトにのみ含まれるため、ボイラープレートコードも削減されます。

構文はクラスでの委譲の使用に似ていますが、異なるレベルで動作します。プロパティを宣言し、その後に`by`キーワードと委譲したいオブジェクトを続けます。例えば：

```kotlin
val displayName: String by Delegate
```

ここで、委譲プロパティ`displayName`は、そのプロパティアクセサーのために`Delegate`オブジェクトを参照します。

委譲するすべてのオブジェクトは、Kotlinが委譲プロパティの値を取得するために使用する`getValue()`演算子関数を**持たなければなりません**。プロパティが可変の場合、Kotlinがその値を設定するために`setValue()`演算子関数も持たなければなりません。

デフォルトでは、`getValue()`関数と`setValue()`関数は以下の構造を持っています。

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

これらの関数では：

*   `operator`キーワードは、これらの関数を演算子関数としてマークし、`get()`関数と`set()`関数をオーバーロードできるようにします。
*   `thisRef`パラメータは、委譲プロパティを**含む**オブジェクトを参照します。デフォルトでは型は`Any?`に設定されていますが、より具体的な型を宣言する必要がある場合があります。
*   `property`パラメータは、値がアクセスまたは変更されるプロパティを参照します。このパラメータを使用して、プロパティの名前や型などの情報にアクセスできます。デフォルトでは型は`Any?`に設定されています。コードでこれを変更することを心配する必要はありません。

`getValue()`関数の戻り値の型はデフォルトで`String`ですが、必要に応じてこれを調整できます。

`setValue()`関数には追加のパラメータ`value`があり、これはプロパティに割り当てられる新しい値を保持するために使用されます。

では、これは実際にどのように見えるでしょうか？ユーザーの表示名のような計算されたプロパティを持ちたいとします。この操作はコストが高く、アプリケーションはパフォーマンスに敏感であるため、一度だけ計算されるようにします。委譲プロパティを使用して表示名をキャッシュすることで、一度だけ計算され、パフォーマンスに影響を与えることなくいつでもアクセスできるようにすることができます。

まず、委譲先のオブジェクトを作成する必要があります。この場合、オブジェクトは`CachedStringDelegate`クラスのインスタンスになります。

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue`プロパティにはキャッシュされた値が含まれます。`CachedStringDelegate`クラス内で、委譲プロパティの`get()`関数から望む動作を`getValue()`演算子関数の本体に追加します。

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

`getValue()`関数は、`cachedValue`プロパティが`null`であるかどうかをチェックします。`null`の場合、関数は`"Default value"`を割り当て、ロギングのために文字列を出力します。`cachedValue`プロパティがすでに計算されている場合、そのプロパティは`null`ではありません。この場合、ロギングのために別の文字列が出力されます。最後に、関数はエルビス演算子を使用して、キャッシュされた値を返すか、値が`null`の場合は`"Unknown"`を返します。

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

    // 最初のアクセスで値を計算し、キャッシュする
    println(user.displayName)
    // Computed and cached: John Doe
    // John Doe

    // 以降のアクセスではキャッシュから値を取得する
    println(user.displayName)
    // Accessed from cache: John Doe
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

この例では：

*   ヘッダーに`firstName`と`lastName`の2つのプロパティを、クラス本体に`displayName`という1つのプロパティを持つ`User`クラスを作成します。
*   `displayName`プロパティを`CachedStringDelegate`クラスのインスタンスに委譲します。
*   `user`という`User`クラスのインスタンスを作成します。
*   `user`インスタンスの`displayName`プロパティにアクセスした結果を出力します。

なお、`getValue()`関数では、`thisRef`パラメータの型が`Any?`型からオブジェクト型である`User`に絞られています。これは、コンパイラが`User`クラスの`firstName`および`lastName`プロパティにアクセスできるようにするためです。

### 標準の委譲

Kotlin標準ライブラリは、便利なデリゲートをいくつか提供しているため、常にゼロから作成する必要はありません。これらのデリゲートのいずれかを使用する場合、標準ライブラリが自動的に`getValue()`関数と`setValue()`関数を提供するため、それらを定義する必要はありません。

#### 遅延プロパティ

プロパティが最初にアクセスされたときにのみ初期化するには、遅延プロパティを使用します。標準ライブラリは委譲のために`Lazy`インターフェースを提供しています。

`Lazy`インターフェースのインスタンスを作成するには、`lazy()`関数を使用し、`get()`関数が初めて呼び出されたときに実行するラムダ式を渡します。`get()`関数のそれ以降の呼び出しは、最初の呼び出しで提供されたものと同じ結果を返します。遅延プロパティは、ラムダ式を渡すために[末尾ラムダ](kotlin-tour-functions.md#trailing-lambdas)構文を使用します。

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
    // databaseConnection に初めてアクセスする
    fetchData()
    // Connecting to the database...
    // Data: [Data1, Data2, Data3]

    // 以降のアクセスでは既存の接続を使用する
    fetchData()
    // Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

この例では：

*   `connect()`関数と`query()`メンバー関数を持つ`Database`クラスがあります。
*   `connect()`関数はコンソールに文字列を出力し、`query()`関数はSQLクエリを受け取ってリストを返します。
*   `databaseConnection`プロパティは遅延プロパティです。
*   `lazy()`関数に提供されるラムダ式は：
    *   `Database`クラスのインスタンスを作成します。
    *   このインスタンス（`db`）上で`connect()`メンバー関数を呼び出します。
    *   インスタンスを返します。
*   `fetchData()`関数は：
    *   `databaseConnection`プロパティ上で`query()`関数を呼び出すことにより、SQLクエリを作成します。
    *   SQLクエリを`data`変数に割り当てます。
    *   `data`変数をコンソールに出力します。
*   `main()`関数は`fetchData()`関数を呼び出します。最初に呼び出されると、遅延プロパティが初期化されます。2回目には、最初の呼び出しと同じ結果が返されます。

遅延プロパティは、初期化がリソースを大量に消費する場合だけでなく、プロパティがコード内で使用されない可能性がある場合にも役立ちます。さらに、遅延プロパティはデフォルトでスレッドセーフであり、これは並行環境で作業している場合に特に有利です。

詳細については、「[遅延プロパティ](delegated-properties.md#lazy-properties)」を参照してください。

#### 監視可能プロパティ

プロパティの値が変更されたかどうかを監視するには、監視可能プロパティを使用します。監視可能プロパティは、プロパティ値の変更を検出し、この知識を使用して反応をトリガーしたい場合に役立ちます。標準ライブラリは委譲のために`Delegates`オブジェクトを提供しています。

監視可能プロパティを作成するには、まず`kotlin.properties.Delegates.observable`をインポートする必要があります。次に、`observable()`関数を使用し、プロパティが変更されるたびに実行するラムダ式を渡します。遅延プロパティと同様に、監視可能プロパティもラムダ式を渡すために[末尾ラムダ](kotlin-tour-functions.md#trailing-lambdas)構文を使用します。

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

*   監視可能プロパティ`temperature`を含む`Thermostat`クラスがあります。
*   `observable()`関数は`20.0`をパラメータとして受け取り、それを使用してプロパティを初期化します。
*   `observable()`関数に提供されるラムダ式は：
    *   3つのパラメータを持ちます：
        *   `_`はプロパティ自体を参照します。
        *   `old`はプロパティの古い値です。
        *   `new`はプロパティの新しい値です。
    *   `new`パラメータが`25`より大きいかどうかをチェックし、結果に応じて文字列をコンソールに出力します。
*   `main()`関数は：
    *   `thermostat`という`Thermostat`クラスのインスタンスを作成します。
    *   インスタンスの`temperature`プロパティの値を`22.5`に更新します。これにより、温度更新のプリント文がトリガーされます。
    *   インスタンスの`temperature`プロパティの値を`27.0`に更新します。これにより、警告のプリント文がトリガーされます。

監視可能プロパティは、ロギングやデバッグの目的だけでなく、UIの更新や、データの有効性の検証のような追加のチェックを実行するユースケースにも使用できます。

詳細については、「[監視可能プロパティ](delegated-properties.md#observable-properties)」を参照してください。

## 練習問題

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

あなたは書店の在庫管理システムを管理しています。在庫はリストとして保存されており、各項目は特定の本の数量を表します。例えば、`listOf(3, 0, 7, 12)`は、店に最初の本が3冊、2番目の本が0冊、3番目の本が7冊、4番目の本が12冊あることを意味します。

在庫切れの本すべてのインデックスのリストを返す`findOutOfStockBooks()`という関数を記述してください。

<deflist collapsible="true">
    <def title="ヒント1">
        標準ライブラリの<a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a>拡張プロパティを使用してください。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="ヒント2">
        手動で可変リストを作成して返す代わりに、<a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a>関数を使用してリストを作成および管理できます。<code>buildList()</code>関数は、以前の章で学んだレシーバーを持つラムダを使用します。
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // ここにコードを記述してください
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 1" id="kotlin-tour-properties-solution-1-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 2" id="kotlin-tour-properties-solution-1-2"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

キロメートルとマイルの両方で距離を表示する必要がある旅行アプリがあります。キロメートル単位の距離をマイルに変換するための、`Double`型の`asMiles`という拡張プロパティを作成してください。

> キロメートルをマイルに変換する式は、`miles = kilometers * 0.621371`です。
>
{style="note"}

<deflist collapsible="true">
    <def title="ヒント">
        拡張プロパティにはカスタム<code>get()</code>関数が必要であることを忘れないでください。
    </def>
</deflist>

|---|---|

```kotlin
val // ここにコードを記述してください

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

あなたはクラウドシステムの健全性を判断できるシステムヘルスチェッカーを持っています。しかし、ヘルスチェックを実行できる2つの関数はパフォーマンスを大量に消費します。コストのかかる関数が必要なときにのみ実行されるように、遅延プロパティを使用してチェックを初期化してください。

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
    // ここにコードを記述してください

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

あなたはシンプルな家計管理アプリを構築しています。このアプリは、ユーザーの残り予算の変化を監視し、特定のしきい値を下回るたびに通知する必要があります。`Budget`クラスがあり、初期予算額を含む`totalBudget`プロパティで初期化されます。クラス内に、`remainingBudget`という監視可能プロパティを作成し、以下を出力するようにしてください。

*   値が初期予算の20%未満になったときに警告。
*   予算が以前の値から増加したときに励ましのメッセージ。

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // ここにコードを記述してください
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