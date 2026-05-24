# Koin アノテーション一覧

このドキュメントは、すべての Koin アノテーション、そのパラメータ、動作、および使用例の包括的な一覧を提供します。

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
- [ViewModel および Android 固有のアノテーション](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [クオリファイア（Qualifier）アノテーション](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [パラメータアノテーション](#parameter-annotations)
  - [@InjectedParam](#injectedparam)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [安全性アノテーション](#safety-annotations)
  - [@Provided](#provided)
- [モジュールおよびアプリケーションアノテーション](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [モニタリングアノテーション](#monitoring-annotations)
  - [@Monitor](#monitor)
- [メタアノテーション（内部用）](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 定義アノテーション

### @Single / @Singleton

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Koin において型または関数を `single`（シングルトン）定義として宣言します。単一のインスタンスが作成され、アプリケーション全体で共有されます。`@Singleton` が推奨される名称（標準的な命名規則）であり、`@Single` はそのエイリアスです。

**パラメータ:**
- `binds: Array<KClass<*>> = [Unit::class]` - この定義に明示的にバインドする型。スーパータイプは自動的に検出されます。
- `createdAtStart: Boolean = false` - `true` の場合、Koin の開始時にインスタンスが作成されます。

**動作:**
すべての依存関係はコンストラクタ注入によって満たされます。

**例:**
```kotlin
@Single
class MyClass(val d : MyDependency)
```

**生成される Koin DSL:**
```kotlin
single { MyClass(get()) }
```

**明示的なバインドを使用する場合:**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**開始時に作成する場合:**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Koin において型または関数を `factory` 定義として宣言します。リクエストされるたびに新しいインスタンスが作成されます。

**パラメータ:**
- `binds: Array<KClass<*>> = [Unit::class]` - この定義に明示的にバインドする型。スーパータイプは自動的に検出されます。

**動作:**
すべての依存関係はコンストラクタ注入によって満たされます。リクエストごとに新しいインスタンスが作成されます。

**例:**
```kotlin
@Factory
class MyClass(val d : MyDependency)
```

**生成される Koin DSL:**
```kotlin
factory { MyClass(get()) }
```

---

### @Scoped

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Koin において型または関数を `scoped` 定義として宣言します。`@Scope` アノテーションと組み合わせて使用する必要があります。インスタンスは特定のスコープ内で共有されます。

**パラメータ:**
- `binds: Array<KClass<*>> = [Unit::class]` - この定義に明示的にバインドする型。スーパータイプは自動的に検出されます。

**動作:**
定義されたスコープの生存期間（ライフタイム）内で存続するスコープ付きインスタンスを作成します。

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

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** クラスを Koin スコープ内で宣言します。スコープ名は値（クラス）または名前（文字列）のいずれかで記述されます。デフォルトでは `scoped` 定義を宣言します。明示的なバインドのために `@Scoped`, `@Factory`, `@KoinViewModel` アノテーションで上書きすることができます。

**パラメータ:**
- `value: KClass<*> = Unit::class` - スコープクラスの値
- `name: String = ""` - スコープ文字列の値

**動作:**
指定されたスコープ型または名前に紐付けられたスコープ定義を作成します。

**クラスを使用した例:**
```kotlin
@Scope(MyScope::class)
class MyClass(val d : MyDependency)
```

**生成される Koin DSL:**
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

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** ViewModelScope という Koin スコープ内でクラスを宣言します。これは、ViewModel のライフサイクル内で存続すべきコンポーネントのためのスコープアーキタイプです。

**パラメータ:** なし

**動作:**
`viewModelScope` 内にスコープ付き定義を作成します。

**例:**
```kotlin
@ViewModelScope
class MyClass(val d : MyDependency)
```

**生成される Koin DSL:**
```kotlin
viewModelScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、ViewModel および `viewModelScope` 関数と共に使用してスコープを有効にするためのものです。

---

### @ActivityScope

**パッケージ:** `org.koin.android.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Activity という Koin スコープ内でクラスを宣言します。

**パラメータ:** なし

**動作:**
`activityScope` 内にスコープ付き定義を作成します。

**例:**
```kotlin
@ActivityScope
class MyClass(val d : MyDependency)
```

**生成される Koin DSL:**
```kotlin
activityScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、Activity および `activityScope` 関数と共に使用してスコープを有効にするためのものです。

---

### @ActivityRetainedScope

**パッケージ:** `org.koin.android.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Activity という Koin スコープ内でクラスを宣言しますが、設定変更（configuration changes）をまたいで保持されます。

**パラメータ:** なし

**動作:**
`activityRetainedScope` 内にスコープ付き定義を作成します。

**例:**
```kotlin
@ActivityRetainedScope
class MyClass(val d : MyDependency)
```

**生成される Koin DSL:**
```kotlin
activityRetainedScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、Activity および `activityRetainedScope` 関数と共に使用してスコープを有効にするためのものです。

---

### @FragmentScope

**パッケージ:** `org.koin.android.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Fragment という Koin スコープ内でクラスを宣言します。

**パラメータ:** なし

**動作:**
`fragmentScope` 内にスコープ付き定義を作成します。

**例:**
```kotlin
@FragmentScope
class MyClass(val d : MyDependency)
```

**生成される Koin DSL:**
```kotlin
fragmentScope {
    scoped { MyClass(get()) }
}
```

**使用法:**
タグ付けされたクラスは、Fragment および `fragmentScope` 関数と共に使用してスコープを有効にするためのものです。

---

### @ScopeId

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `VALUE_PARAMETER`

**説明:** クラスのコンストラクタまたは関数のパラメータにアノテーションを付け、特定のスコープ ID を持つ指定されたスコープからの解決を要求します。

**パラメータ:**
- `value: KClass<*> = Unit::class` - スコープ型
- `name: String = ""` - スコープ文字列識別子

**動作:**
型または名前によって識別される特定のスコープから依存関係を解決します。

**文字列名を使用した例:**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**生成される Koin DSL:**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**型を使用した例:**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel および Android 固有のアノテーション

### @KoinViewModel

**パッケージ:** `org.koin.android.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Koin 定義用の ViewModel アノテーションです。Koin において型または関数を `viewModel` 定義として宣言します。

**プラットフォーム・サポート:**
- ✅ Android
- ✅ Kotlin Multiplatform (KMP)
- ✅ Compose Multiplatform (CMP)

**パラメータ:**
- `binds: Array<KClass<*>> = []` - この定義に明示的にバインドする型。スーパータイプは自動的に検出されます。

**動作:**
すべての依存関係はコンストラクタ注入によって満たされます。Koin によって管理される ViewModel インスタンスを作成します。Compose Multiplatform を使用する場合、Android、iOS、デスクトップ、および Web を含むすべてのプラットフォームで動作します。

**例 (Android/CMP):**
```kotlin
@KoinViewModel
class MyViewModel(val d : MyDependency) : ViewModel()
```

**例 (KMP/CMP shared):**
```kotlin
@KoinViewModel
class SharedViewModel(
    val repository: Repository,
    val analytics: Analytics
) : ViewModel()
```

**生成される Koin DSL:**
```kotlin
viewModel { MyViewModel(get()) }
```

---

### @KoinWorker

**パッケージ:** `org.koin.android.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Koin 定義用の Worker アノテーションです。WorkManager のワーカーとして型を `worker` 定義として宣言します。

**パラメータ:**
- `binds: Array<KClass<*>> = []` - この定義に明示的にバインドする型。

**動作:**
Android WorkManager 連携用のワーカー定義を作成します。

**例:**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## クオリファイア（Qualifier）アノテーション

### @Named

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**説明:** 指定された定義にクオリファイアを定義します。`StringQualifier("...")` または型ベースのクオリファイアを生成します。

**パラメータ:**
- `value: String = ""` - 文字列クオリファイア
- `type: KClass<*> = Unit::class` - クラスクオリファイア

**動作:**
同じ型の複数の定義を区別するために使用されます。

**文字列を使用した例:**
```kotlin
@Single
@Named("special")
class MyClass(val d : MyDependency)
```

**パラメータでの使用法:**
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

**ターゲット:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**説明:** 指定された定義にクオリファイアを定義します。`@Named` と似ていますが、パラメータの優先順位が逆になっています。

**パラメータ:**
- `value: KClass<*> = Unit::class` - クラスクオリファイア
- `name: String = ""` - 文字列クオリファイア

**動作:**
同じ型の複数の定義を区別するために使用されます。

**例:**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## パラメータアノテーション

### @InjectedParam

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `VALUE_PARAMETER`

**説明:** コンストラクタまたは関数のパラメータを、DI コンテナからではなく `ParametersHolder`（呼び出し側で `parametersOf()` を介して渡される）から解決するようにマークします。

**パラメータ:** なし

**動作:**
実行時に Koin の定義からではなく `ParametersHolder.get()` からパラメータ値を解決します。コンパイル時の安全性検証（Compile safety validation）は、`@InjectedParam` が付いたパラメータをスキップします。

**例:**
```kotlin
@Factory
class MyClass(@InjectedParam val id: Int, val service: Service)
```

**生成される Koin DSL:**
```kotlin
factory { params -> MyClass(params.get(), get()) }
```

**使用法:**
```kotlin
val instance = koin.get<MyClass> { parametersOf(42) }
```

---

### @Property

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `VALUE_PARAMETER`

**説明:** コンストラクタのパラメータまたは関数のパラメータにアノテーションを付け、Koin プロパティとして解決するようにします。

**パラメータ:**
- `value: String` - プロパティ名

**動作:**
依存関係の注入ではなく、Koin プロパティからパラメータ値を解決します。

**例:**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**生成される Koin DSL:**
```kotlin
factory { MyClass(getProperty("name")) }
```

**デフォルト値を使用する場合:**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**生成される Koin DSL:**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

### @PropertyValue

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `FIELD`

**説明:** プロパティのデフォルト値となるフィールド値にアノテーションを付けます。

**パラメータ:**
- `value: String` - プロパティ名

**動作:**
プロパティが見つからない場合に使用できるプロパティのデフォルト値を定義します。

**例:**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**生成される Koin DSL:**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

## 安全性アノテーション

### @Provided

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `VALUE_PARAMETER`

**説明:** 実行時に外部から提供される型またはパラメータであることをマークします（例: Android フレームワークの型、サードパーティ SDK など）。コンパイル時の安全性検証は、これらの型をスキップします。

**パラメータ:** なし

**動作:**
- **クラス**に適用した場合: その型のすべての使用箇所でコンパイル時の安全性検証がスキップされます。
- **パラメータ**に適用した場合: その特定のパラメータのみ検証がスキップされます。
- 型は実行時に `scope.get<T>()` を介して解決されます。`@Provided` はコンパイル時のチェックにのみ影響します。

**クラスへの適用例:**
```kotlin
@Provided
class FirebaseAnalytics  // すべての使用箇所で検証がスキップされる

@Singleton
class AnalyticsService(val analytics: FirebaseAnalytics)
// コンパイルエラーは発生しません — FirebaseAnalytics は @Provided です
```

**パラメータへの適用例:**
```kotlin
@Factory
class PaymentProcessor(@Provided val gateway: PaymentGateway)
// コンパイルエラーは発生しません — このパラメータのみ検証がスキップされます
```

**注:** 一般的な Android フレームワークの型（`Context`, `Application`, `Activity`, `Fragment`, `SavedStateHandle`, `WorkerParameters`）は自動的にホワイトリストに登録されているため、`@Provided` を付ける必要はありません。

**参照:** [コンパイル時の安全性](/docs/reference/koin-compiler/compile-safety#external-types-provided)

---

## モジュールおよびアプリケーションアノテーション

### @Module

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`

**説明:** Koin モジュール内の定義を収集しやすくするためのクラスアノテーションです。各関数に Koin 定義アノテーションを付けることができます。

**パラメータ:**
- `includes: Array<KClass<*>> = []` - インクルードするモジュールクラス
- `createdAtStart: Boolean = false` - `true` の場合、モジュールインスタンスが開始時に作成されます

**動作:**
モジュール内のすべてのアノテーション付き関数およびクラスを収集します。

**例:**
```kotlin
@Module
class MyModule {
    @Single
    fun myClass(d : MyDependency) = MyClass(d)
}
```

**生成される Koin DSL:**
```kotlin
val MyModule.module = module {
    val moduleInstance = MyModule()
    single { moduleInstance.myClass(get()) }
}
```

**インクルードを使用する場合:**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // 定義
}
```

---

### @ComponentScan

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `FIELD`

**説明:** Koin 定義アノテーションで宣言された定義を収集します。現在のパッケージまたは明示的なパッケージ名をスキャンします。

**パラメータ:**
- `value: vararg String = []` - スキャンするパッケージ（glob パターンをサポート）

**動作:**
指定されたパッケージ内のアノテーション付きクラスをスキャンします。正確なパッケージ名と glob パターンの両方をサポートします。

**Glob パターンのサポート:**

1. **正確なパッケージ名（ワイルドカードなし）:**
   - `com.example.service` - パッケージとそのすべてのサブパッケージをスキャンします（`com.example**` と等価）

2. **ルートを含むマルチレベルスキャン:**
   - `com.example**` - `com.example` とそのすべてのサブパッケージをスキャンします

3. **ルートを除くマルチレベルスキャン:**
   - `com.example.**` - `com.example` のサブパッケージのみをスキャンし、ルートは除外します

4. **シングルレベルのワイルドカード:**
   - `com.example.*.service` - 正確に 1 レベルに一致します（例: `com.example.user.service`）

5. **組み合わせたワイルドカード:**
   - `com.**.service.*data` - 複雑なパターンマッチング
   - `com.*.service.**` - パターンに合致するサブパッケージをスキャン

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

**例 - glob パターンを使用:**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `FIELD`

**説明:** `@Module` クラスに適用され、それを 1 つ以上の構成（タグ/フレーバー）に関連付けます。

**パラメータ:**
- `value: vararg String = []` - 構成名

**動作:**
条件付きロードのために、モジュールを構成（Configuration）ごとにグループ化できます。

**デフォルト構成:**
```kotlin
@Module
@Configuration
class MyModule
```
このモジュールは "default" 構成の一部です。

**複数の構成:**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
このモジュールは "prod" と "test" の両方の構成で使用可能です。

**デフォルトを含める場合:**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
default と test の構成で使用可能です。

**注:** `@Configuration("default")` は `@Configuration` と同等です。

---

### @KoinApplication

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`

**説明:** クラスを Koin アプリケーションのエントリポイントとしてタグ付けします。`startKoin()` または `koinApplication()` 関数を使用して Koin アプリケーションのブートストラップを生成します。

**パラメータ:**
- `configurations: Array<String> = []` - スキャンする構成名のリスト
- `modules: Array<KClass<*>> = [Unit::class]` - 構成以外にロードするモジュールのリスト

**動作:**
構成とインクルードされたモジュールをスキャンするブートストラップ関数を生成します。

**例 - デフォルト構成:**
```kotlin
@KoinApplication
class MyApp
```

**生成される関数:**
```kotlin
MyApp.startKoin()
MyApp.koinApplication()
```

**例 - 特定の構成:**
```kotlin
@KoinApplication(configurations = ["default", "prod"])
class MyApp
```

**例 - モジュールを指定:**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**カスタム構成での使用法:**
```kotlin
MyApp.startKoin {
    printLogger()
    // 追加の構成
}
```

---

## モニタリングアノテーション

### @Monitor

**パッケージ:** `org.koin.core.annotation`

**ターゲット:** `CLASS`, `FUNCTION`

**説明:** Koin の公式ツールプラットフォームである Kotzilla Platform を通じて、自動モニタリングおよびパフォーマンス追跡を行うためのクラスまたは関数をマークします。

**パラメータ:** なし

**動作:**
- クラスに適用した場合: すべてのパブリックメソッド呼び出しを監視する Koin プロキシを生成します。
- 関数に適用した場合: Koin 管理コンポーネント内の特定のメソッドを監視します。
- パフォーマンス指標、エラー率、使用パターンを自動的にキャプチャします。
- リアルタイム分析のためにデータを Kotzilla ワークスペースに送信します。

**要件:**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 有効な Kotzilla Platform アカウントと API キー

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

**導入:** Kotzilla 1.2.1 以降

---

## メタアノテーション（内部用）

これらのアノテーションは、Koin コンパイラおよびコード生成による内部使用のみを目的としています。

### @ExternalDefinition

**パッケージ:** `org.koin.meta.annotations`

**ターゲット:** `CLASS`, `FIELD`, `FUNCTION`

**説明:** 生成されたパッケージ内でのコンポーネント検出のための内部用途。

**パラメータ:**
- `value: String = ""` - 宣言された定義のパッケージ

---

### @MetaDefinition

**パッケージ:** `org.koin.meta.annotations`

**ターゲット:** `CLASS`, `FUNCTION`, `PROPERTY`

**説明:** 定義メタデータを表現するためのメタ定義アノテーション。

**パラメータ:**
- `value: String = ""` - 定義のフルパス
- `moduleTagId: String = ""` - モジュールタグ + ID（形式: "module_id:module_tag"）
- `dependencies: Array<String> = []` - チェックするパラメータタグ
- `binds: Array<String> = []` - バインドされた型
- `qualifier: String = ""` - クオリファイア
- `scope: String = ""` - 宣言されているスコープ

---

### @MetaModule

**パッケージ:** `org.koin.meta.annotations`

**ターゲット:** `CLASS`

**説明:** モジュールメタデータを表現するためのメタモジュールアノテーション。

**パラメータ:**
- `value: String = ""` - モジュールのフルパス
- `id: String = ""` - モジュール ID
- `includes: Array<String> = []` - チェックするインクルードモジュールタグ
- `configurations: Array<String> = []` - チェックするモジュール構成
- `isObject: Boolean = false` - モジュールがオブジェクトかどうか

---

### @MetaApplication

**パッケージ:** `org.koin.meta.annotations`

**ターゲット:** `CLASS`

**説明:** アプリケーションメタデータを表現するためのメタアプリケーションアノテーション。

**パラメータ:**
- `value: String = ""` - アプリケーションのフルパス
- `includes: Array<String> = []` - チェックする使用済みモジュールタグ
- `configurations: Array<String> = []` - チェックする使用済み構成モジュール

---

## 要約テーブル

| アノテーション | パッケージ | 目的 | 一般的なユースケース |
|------------|---------|---------|-----------------|
| `@Singleton` / `@Single` | `org.koin.core.annotation` | シングルトン定義 | 共有アプリケーションサービス |
| `@Factory` | `org.koin.core.annotation` | ファクトリ定義 | リクエストごとのインスタンス |
| `@Scoped` | `org.koin.core.annotation` | スコープ付き定義 | スコープ固有のインスタンス |
| `@Scope` | `org.koin.core.annotation` | スコープ宣言 | カスタムスコープ |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModel スコープ | ViewModel スコープの依存関係 |
| `@ActivityScope` | `org.koin.android.annotation` | Activity スコープ | Activity スコープの依存関係 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 保持される Activity スコープ | 設定変更に耐える依存関係 |
| `@FragmentScope` | `org.koin.android.annotation` | Fragment スコープ | Fragment スコープの依存関係 |
| `@ScopeId` | `org.koin.core.annotation` | スコープ解決 | 特定のスコープから解決 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel 定義 | Android/KMP/CMP ViewModel |
| `@KoinWorker` | `org.koin.android.annotation` | Worker 定義 | WorkManager ワーカー |
| `@Named` | `org.koin.core.annotation` | 文字列/型クオリファイア | 同一型の Bean の区別 |
| `@Qualifier` | `org.koin.core.annotation` | 型/文字列クオリファイア | 同一型の Bean の区別 |
| `@InjectedParam` | `org.koin.core.annotation` | 実行時パラメータ | `parametersOf()` の値 |
| `@Property` | `org.koin.core.annotation` | プロパティ注入 | 設定値 |
| `@PropertyValue` | `org.koin.core.annotation` | プロパティデフォルト値 | デフォルト設定値 |
| `@Provided` | `org.koin.core.annotation` | 安全性検証のスキップ | 外部/フレームワークの型 |
| `@Module` | `org.koin.core.annotation` | モジュール宣言 | 定義のグループ化 |
| `@ComponentScan` | `org.koin.core.annotation` | パッケージスキャン | 定義の自動検出 |
| `@Configuration` | `org.koin.core.annotation` | モジュール構成 | ビルドバリアント/フレーバー |
| `@KoinApplication` | `org.koin.core.annotation` | アプリエントリポイント | Koin のブートストラップ |
| `@Monitor` | `org.koin.core.annotation` | パフォーマンス監視 | 本番環境のモニタリング |

---

**ドキュメントバージョン:** 1.0
**最終更新日:** 2025年10月20日
**Koin Annotations バージョン:** 2.2.x+