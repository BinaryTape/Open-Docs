# Koinアノテーション インベントリ

本ドキュメントでは、すべてのKoinアノテーション、そのパラメータ、動作、および使用例の包括的なインベントリを提供します。

## 目次

- [定義アノテーション](#definition-annotations)
  - [@Single](#single)
  - [@Factory](#factory)
  - [@Scoped](#scoped)
- [スコープアノテーション](#scope-annotations)
  - [@Scope](#scope)
  - [@ViewModelScope](#viewmodelscope)
  - [@ActivityScope](#activityscope)
  - [@ActivityRetainedScope](#activityretainedscope)
  - [@FragmentScope](#fragmentscope)
  - [@ScopeId](#scopeid)
- [ViewModel & Android特有のアノテーション](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [限定子アノテーション](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [プロパティアノテーション](#property-annotations)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [モジュール & アプリケーションアノテーション](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [モニタリングアノテーション](#monitoring-annotations)
  - [@Monitor](#monitor)
- [メタアノテーション (内部)](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 定義アノテーション

### @Single

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** 型または関数をKoinにおける`single`（シングルトン）定義として宣言します。単一のインスタンスが作成され、アプリケーション全体で共有されます。

**パラメータ:**
- `binds: Array<KClass<*>> = [Unit::class]` - この定義にバインドする明示的な型。スーパータイプは自動的に検出されます。
- `createdAtStart: Boolean = false` - `true`の場合、Koinが起動する際にインスタンスが作成されます。

**動作:**
すべての依存関係はコンストラクタインジェクションによって満たされます。

**例:**
```kotlin
@Single
class MyClass(val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
single { MyClass(get()) }
```

**明示的なバインディングを使用する例:**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**起動時に作成する例:**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** 型または関数をKoinにおける`factory`定義として宣言します。リクエストされるたびに新しいインスタンスが作成されます。

**パラメータ:**
- `binds: Array<KClass<*>> = [Unit::class]` - この定義にバインドする明示的な型。スーパータイプは自動的に検出されます。

**動作:**
すべての依存関係はコンストラクタインジェクションによって満たされます。リクエストごとに新しいインスタンスが作成されます。

**例:**
```kotlin
@Factory
class MyClass(val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
factory { MyClass(get()) }
```

---

### @Scoped

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** 型または関数をKoinにおける`scoped`定義として宣言します。`@Scope`アノテーションと関連付ける必要があります。インスタンスは特定のスコープ内で共有されます。

**パラメータ:**
- `binds: Array<KClass<*>> = [Unit::class]` - この定義にバインドする明示的な型。スーパータイプは自動的に検出されます。

**動作:**
定義されたスコープのライフタイム内で存続するスコープ付きインスタンスを作成します。

**例:**
```kotlin
@Scope(MyScope::class)
@Scoped
class MyClass(val d : MyDependency)
```

**参照:** [@Scope](#scope)

---

## スコープアノテーション

### @Scope

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** クラスをKoinスコープ内で宣言します。スコープ名はvalue（クラス）またはname（文字列）のいずれかで記述されます。デフォルトでは、`scoped`定義を宣言します。明示的なバインディングのために、`@Scoped`、`@Factory`、`@KoinViewModel`アノテーションで上書きできます。

**パラメータ:**
- `value: KClass<*> = Unit::class` - スコープクラスの値
- `name: String = ""` - スコープ文字列の値

**動作:**
指定されたスコープタイプまたは名前に対応するスコープ定義を作成します。

**クラスを使用した例:**
```kotlin
@Scope(MyScope::class)
class MyClass(val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
scope<MyScope> {
    scoped { MyClass(get()) }
}
```

**文字列名を使用した例:**
```kotlin
@Scope(name = "my_custom_scope")
class MyClass(val d : MyDependency)
```

---

### @ViewModelScope

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** クラスをViewModelScope Koinスコープ内で宣言します。これは、ViewModelのライフサイクル内で存続すべきコンポーネントのためのスコープの原型です。

**パラメータ:** なし

**動作:**
`viewModelScope`内でスコープ付き定義を作成します。

**例:**
```kotlin
@ViewModelScope
class MyClass(val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
viewModelScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、スコープをアクティブ化するためにViewModelおよび`viewModelScope`関数とともに使用されることを意図しています。

---

### @ActivityScope

**パッケージ:** `org.koin.android.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** クラスをActivity Koinスコープ内で宣言します。

**パラメータ:** なし

**動作:**
`activityScope`内でスコープ付き定義を作成します。

**例:**
```kotlin
@ActivityScope
class MyClass(val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
activityScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、スコープをアクティブ化するためにActivityおよび`activityScope`関数とともに使用されることを意図しています。

---

### @ActivityRetainedScope

**パッケージ:** `org.koin.android.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** クラスをActivity Koinスコープ内で宣言しますが、設定変更後も保持されます。

**パラメータ:** なし

**動作:**
`activityRetainedScope`内でスコープ付き定義を作成します。

**例:**
```kotlin
@ActivityRetainedScope
class MyClass(val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
activityRetainedScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、スコープをアクティブ化するためにActivityおよび`activityRetainedScope`関数とともに使用されることを意図しています。

---

### @FragmentScope

**パッケージ:** `org.koin.android.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** クラスをFragment Koinスコープ内で宣言します。

**パラメータ:** なし

**動作:**
`fragmentScope`内でスコープ付き定義を作成します。

**例:**
```kotlin
@FragmentScope
class MyClass(val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
fragmentScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、スコープをアクティブ化するためにFragmentおよび`fragmentScope`関数とともに使用されることを意図しています。

---

### @ScopeId

**パッケージ:** `org.koin.core.annotation`

**対象:** `VALUE_PARAMETER`

**説明:** クラスコンストラクタまたは関数のパラメータにアノテーションを付け、特定のスコープIDを持つスコープに対する解決を要求します。

**パラメータ:**
- `value: KClass<*> = Unit::class` - スコープの型
- `name: String = ""` - スコープの文字列識別子

**動作:**
型または名前で識別される特定のスコープから依存関係を解決します。

**文字列名を使用した例:**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**生成されるKoin DSL:**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**型を使用した例:**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel & Android特有のアノテーション

### @KoinViewModel

**パッケージ:** `org.koin.android.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** Koin定義のためのViewModelアノテーション。型または関数をKoinにおける`viewModel`定義として宣言します。

**プラットフォームサポート:**
- ✅ Android
- ✅ Kotlin Multiplatform (KMP)
- ✅ Compose Multiplatform (CMP)

**パラメータ:**
- `binds: Array<KClass<*>> = []` - この定義にバインドする明示的な型。スーパータイプは自動的に検出されます。

**動作:**
すべての依存関係はコンストラクタインジェクションによって満たされます。Koinによって管理されるViewModelインスタンスを作成します。Compose Multiplatformを使用する場合、Android、iOS、デスクトップ、Webを含むすべてのプラットフォームで動作します。

**例 (Android/CMP):**
```kotlin
@KoinViewModel
class MyViewModel(val d : MyDependency) : ViewModel()
```

**例 (KMP/CMP共有):**
```kotlin
@KoinViewModel
class SharedViewModel(
    val repository: Repository,
    val analytics: Analytics
) : ViewModel()
```

**生成されるKoin DSL:**
```kotlin
viewModel { MyViewModel(get()) }
```

---

### @KoinWorker

**パッケージ:** `org.koin.android.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** Koin定義のためのWorkerアノテーション。型をWorkManagerワーカーのための`worker`定義として宣言します。

**パラメータ:**
- `binds: Array<KClass<*>> = []` - この定義にバインドする明示的な型。

**動作:**
Android WorkManager統合のためのワーカー定義を作成します。

**例:**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## 限定子アノテーション

### @Named

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**説明:** 与えられた定義に対する限定子を定義します。`StringQualifier("...")`または型ベースの限定子を生成します。

**パラメータ:**
- `value: String = ""` - 文字列限定子
- `type: KClass<*> = Unit::class` - クラス限定子

**動作:**
同じ型の複数の定義を区別するために使用されます。

**文字列を使用した例:**
```kotlin
@Single
@Named("special")
class MyClass(val d : MyDependency)
```

**パラメータでの使用:**
```kotlin
@Single
class Consumer(@Named("special") val myClass: MyClass)
```

**型を使用した例:**
```kotlin
@Single
@Named(type = MyType::class)
class MyClass(val d : MyDependency)
```

---

### @Qualifier

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**説明:** 与えられた定義に対する限定子を定義します。`@Named`に似ていますが、パラメータの優先順位が逆です。

**パラメータ:**
- `value: KClass<*> = Unit::class` - クラス限定子
- `name: String = ""` - 文字列限定子

**動作:**
同じ型の複数の定義を区別するために使用されます。

**例:**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## プロパティアノテーション

### @Property

**パッケージ:** `org.koin.core.annotation`

**対象:** `VALUE_PARAMETER`

**説明:** コンストラクタパラメータまたは関数パラメータにアノテーションを付け、Koinプロパティとして解決するようにします。

**パラメータ:**
- `value: String` - プロパティ名

**動作:**
パラメータの値を依存関係インジェクションの代わりにKoinプロパティから解決します。

**例:**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**生成されるKoin DSL:**
```kotlin
factory { MyClass(getProperty("name")) }
```

**デフォルト値を使用する例:**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**生成されるKoin DSL:**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

### @PropertyValue

**パッケージ:** `org.koin.core.annotation`

**対象:** `FIELD`

**説明:** プロパティのデフォルト値となるフィールド値にアノテーションを付けます。

**パラメータ:**
- `value: String` - プロパティ名

**動作:**
プロパティが見つからない場合に使用できる、プロパティのデフォルト値を定義します。

**例:**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**生成されるKoin DSL:**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

## モジュール & アプリケーションアノテーション

### @Module

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`

**説明:** Koinモジュール内の定義を収集するのに役立つクラスアノテーション。各関数はKoin定義アノテーションでアノテーションを付けることができます。

**パラメータ:**
- `includes: Array<KClass<*>> = []` - インクルードするモジュールクラス
- `createdAtStart: Boolean = false` - `true`の場合、モジュールインスタンスは起動時に作成されます

**動作:**
モジュール内のすべてのアノテーション付き関数とクラスを収集します。

**例:**
```kotlin
@Module
class MyModule {
    @Single
    fun myClass(d : MyDependency) = MyClass(d)
}
```

**生成されるKoin DSL:**
```kotlin
val MyModule.module = module {
    val moduleInstance = MyModule()
    single { moduleInstance.myClass(get()) }
}
```

**インクルードを使用する例:**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // definitions
}
```

---

### @ComponentScan

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FIELD`

**説明:** Koin定義アノテーションで宣言された定義を収集します。現在のパッケージまたは明示的なパッケージ名をスキャンします。

**パラメータ:**
- `value: vararg String = []` - スキャンするパッケージ (globパターンをサポート)

**動作:**
指定されたパッケージでアノテーション付きクラスをスキャンします。正確なパッケージ名とglobパターンの両方をサポートします。

**Globパターンサポート:**

1.  **正確なパッケージ名（ワイルドカードなし）:**
    *   `com.example.service` - パッケージとすべてのサブパッケージをスキャンします（`com.example**`と同等）

2.  **ルートを含む複数レベルのスキャン:**
    *   `com.example**` - `com.example`とすべてのサブパッケージをスキャンします

3.  **ルートを除く複数レベルのスキャン:**
    *   `com.example.**` - `com.example`のサブパッケージのみをスキャンし、ルートは除外します

4.  **単一レベルのワイルドカード:**
    *   `com.example.*.service` - ちょうど1つのレベルに一致します（例: `com.example.user.service`）

5.  **組み合わせたワイルドカード:**
    *   `com.**.service.*data` - 複雑なパターンマッチング
    *   `com.*.service.**` - パターン下のサブパッケージをスキャンします

**例 - 現在のパッケージをスキャン:**
```kotlin
@ComponentScan
class MyApp
```

**例 - 特定のパッケージをスキャン:**
```kotlin
@ComponentScan("com.example.services", "com.example.repositories")
class MyApp
```

**例 - globパターンを使用:**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FIELD`

**説明:** `@Module`クラスに適用され、1つ以上の設定（タグ/フレーバー）と関連付けます。

**パラメータ:**
- `value: vararg String = []` - 設定名

**動作:**
モジュールは、条件付きロードのために設定にグループ化できます。

**デフォルト設定:**
```kotlin
@Module
@Configuration
class MyModule
```
このモジュールは「default」設定の一部です。

**複数の設定:**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
このモジュールは「prod」と「test」の両方の設定で利用できます。

**デフォルトと併用:**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
デフォルトとテスト設定で利用できます。

**注:** `@Configuration("default")`は`@Configuration`と同等です。

---

### @KoinApplication

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`

**説明:** クラスをKoinアプリケーションのエントリポイントとしてタグ付けします。`startKoin()`または`koinApplication()`関数でKoinアプリケーションのブートストラップを生成します。

**パラメータ:**
- `configurations: Array<String> = []` - スキャンする設定名のリスト
- `modules: Array<KClass<*>> = [Unit::class]` - 設定の他にロードするモジュールのリスト

**動作:**
設定と含まれるモジュールをスキャンするブートストラップ関数を生成します。

**例 - デフォルト設定:**
```kotlin
@KoinApplication
class MyApp
```

**生成される関数:**
```kotlin
MyApp.startKoin()
MyApp.koinApplication()
```

**例 - 特定の設定:**
```kotlin
@KoinApplication(configurations = ["default", "prod"])
class MyApp
```

**例 - モジュールを使用:**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**カスタム設定での使用法:**
```kotlin
MyApp.startKoin {
    printLogger()
    // additional configuration
}
```

---

## モニタリングアノテーション

### @Monitor

**パッケージ:** `org.koin.core.annotation`

**対象:** `CLASS`, `FUNCTION`

**説明:** Koinの公式ツールプラットフォームであるKotzilla Platformを通じた自動モニタリングおよびパフォーマンス追跡のために、クラスまたは関数をマークします。

**パラメータ:** なし

**動作:**
- クラスに適用された場合: すべてのパブリックメソッド呼び出しを監視するKoinプロキシを生成します。
- 関数に適用された場合: Koin管理コンポーネント内の特定のメソッドを監視します。
- パフォーマンスメトリクス、エラー率、および使用パターンを自動的に取得します。
- リアルタイム分析のためにデータをKotzillaワークスペースに送信します。

**要件:**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 有効なKotzilla PlatformアカウントとAPIキー

**例:**
```kotlin
@Monitor
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
}
```

**リソース:**
- [Kotzilla Platform](https://kotzilla.io)
- [完全なドキュメント](https://doc.kotzilla.io)
- [最新バージョン](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)

**以降:** Kotzilla 1.2.1

---

## メタアノテーション (内部)

これらのアノテーションは、Koinコンパイラとコード生成による内部使用のみを目的としています。

### @ExternalDefinition

**パッケージ:** `org.koin.meta.annotations`

**対象:** `CLASS`, `FIELD`, `FUNCTION`

**説明:** 生成されたパッケージ内のコンポーネント検出のための内部使用。

**パラメータ:**
- `value: String = ""` - 宣言された定義のパッケージ

---

### @MetaDefinition

**パッケージ:** `org.koin.meta.annotations`

**対象:** `CLASS`, `FUNCTION`, `PROPERTY`

**説明:** 定義メタデータを表現するのに役立つメタ定義アノテーション。

**パラメータ:**
- `value: String = ""` - 定義の完全パス
- `moduleTagId: String = ""` - モジュールタグ + ID (形式: "module_id:module_tag")
- `dependencies: Array<String> = []` - 確認するパラメータタグ
- `binds: Array<String> = []` - バインドされた型
- `qualifier: String = ""` - 限定子
- `scope: String = ""` - 宣言されているスコープ

---

### @MetaModule

**パッケージ:** `org.koin.meta.annotations`

**対象:** `CLASS`

**説明:** モジュールメタデータを表現するのに役立つメタモジュールアノテーション。

**パラメータ:**
- `value: String = ""` - モジュールの完全パス
- `id: String = ""` - モジュールID
- `includes: Array<String> = []` - 確認するインクルードモジュールタグ
- `configurations: Array<String> = []` - 確認するモジュール設定
- `isObject: Boolean = false` - モジュールがオブジェクトであるかどうか

---

### @MetaApplication

**パッケージ:** `org.koin.meta.annotations`

**対象:** `CLASS`

**説明:** アプリケーションメタデータを表現するのに役立つメタアプリケーションアノテーション。

**パラメータ:**
- `value: String = ""` - アプリケーションの完全パス
- `includes: Array<String> = []` - 確認する使用モジュールタグ
- `configurations: Array<String> = []` - 確認する使用設定モジュール

---

## 非推奨のアノテーション

### @Singleton

**パッケージ:** `org.koin.core.annotation`

**ステータス:** 非推奨 - ERRORレベル

**代替:** 代わりに`koin-jsr330`パッケージの`@Singleton`を使用してください

**説明:** `@Single`と同じですが、JSR-330準拠のために非推奨となりました。

---

## 要約表

| アノテーション | パッケージ | 目的 | 一般的な使用例 |
|------------|---------|---------|-----------------|
| `@Single` | `org.koin.core.annotation` | シングルトン定義 | 共有アプリケーションサービス |
| `@Factory` | `org.koin.core.annotation` | ファクトリ定義 | リクエストごとのインスタンス |
| `@Scoped` | `org.koin.core.annotation` | スコープ付き定義 | スコープ固有のインスタンス |
| `@Scope` | `org.koin.core.annotation` | スコープ宣言 | カスタムスコープ |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModelスコープ | ViewModelスコープの依存関係 |
| `@ActivityScope` | `org.koin.android.annotation` | Activityスコープ | Activityスコープの依存関係 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 保持されるActivityスコープ | 設定変更後も存続する依存関係 |
| `@FragmentScope` | `org.koin.android.annotation` | Fragmentスコープ | Fragmentスコープの依存関係 |
| `@ScopeId` | `org.koin.core.annotation` | スコープ解決 | 特定のスコープから解決 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel定義 | Android/KMP/CMP ViewModel |
| `@KoinWorker` | `org.koin.android.annotation` | Worker定義 | WorkManagerワーカー |
| `@Named` | `org.koin.core.annotation` | 文字列/型限定子 | 同型Beanの区別 |
| `@Qualifier` | `org.koin.core.annotation` | 型/文字列限定子 | 同型Beanの区別 |
| `@Property` | `org.koin.core.annotation` | プロパティインジェクション | 設定値 |
| `@PropertyValue` | `org.koin.core.annotation` | プロパティデフォルト | デフォルト設定値 |
| `@Module` | `org.koin.core.annotation` | モジュール宣言 | 定義のグループ化 |
| `@ComponentScan` | `org.koin.core.annotation` | パッケージスキャン | 定義の自動検出 |
| `@Configuration` | `org.koin.core.annotation` | モジュール設定 | ビルドバリアント/フレーバー |
| `@KoinApplication` | `org.koin.core.annotation` | アプリケーションエントリポイント | Koinのブートストラップ |
| `@Monitor` | `org.koin.core.annotation` | パフォーマンス監視 | 本番環境監視 |

---

**ドキュメントバージョン:** 1.0
**最終更新日:** 20-10-2025
**Koinアノテーション バージョン:** 2.2.x+