---
title: アプリケーション、設定、およびモジュール
---

## @KoinApplication によるアプリケーションのブートストラップ

完全な Koin アプリケーションのブートストラップを作成するには、エントリポイントクラスで `@KoinApplication` アノテーションを使用できます。このアノテーションは、Koin アプリケーションのブートストラップ関数を生成するのに役立ちます。

```kotlin
@KoinApplication // デフォルト設定をロード
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

これにより、Koin アプリケーションを開始するための **2 つ** の関数が生成されます。

```kotlin
// 以下のインポートにより、生成された拡張関数にアクセスできるようになります
import org.koin.ksp.generated.*

fun main() {
    // オプション 1: Koin を直接開始する
    MyApp.startKoin()
    
    // オプション 2: KoinApplication インスタンスを取得する
    val koinApp = MyApp.koinApplication()
}
```

生成された両方の関数は、カスタム設定をサポートしています。

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // その他の Koin 設定を追加
    }
    
    // または koinApplication を使用
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` アノテーションは以下をサポートしています：
- `configurations`: スキャンしてロードする設定名の配列
- `modules`: 直接含めるモジュールクラスの配列（設定に加えて追加されるもの）

:::info
設定が指定されていない場合、自動的に "default" 設定がロードされます。
:::

## @Configuration による設定管理

`@Configuration` アノテーションを使用すると、モジュールを異なる設定（環境、フレーバーなど）に整理できます。これは、デプロイ環境や機能セットごとにモジュールを整理するのに便利です。

### 基本的な設定の使用方法

```kotlin
// モジュールをデフォルトの Configuration に配置
@Module
@Configuration
class CoreModule
```

:::info
デフォルトの設定名は "default" です。`@Configuration` または `@Configuration("default")` として使用できます。
:::

設定からモジュールをスキャンできるようにするには、`@KoinApplication` を使用する必要があります。

```kotlin
// モジュール A
@Module
@Configuration
class ModuleA

// モジュール B
@Module
@Configuration
class ModuleB

// アプリケーションモジュール、すべての @Configuration モジュールをスキャン
@KoinApplication
object MyApp
```

### 複数設定のサポート

モジュールは複数の設定に関連付けることができます。

```kotlin
// このモジュールは "prod" と "test" 両方の設定で使用可能です
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// このモジュールは default、test、development で使用可能です
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 環境固有の設定

```kotlin
// 開発環境専用の設定
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// 本番環境専用の設定  
@Module
@Configuration("production")
class ProdDatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 複数の環境で使用可能
@Module
@Configuration("default", "production", "development")
class CoreModule {
    @Single
    fun logger() = Logger()
}
```

### @KoinApplication での設定の使用

デフォルトでは、`@KoinApplication` はすべてのデフォルト設定（`@Configuration` でタグ付けされたモジュール）をロードします。

アプリケーションのブートストラップでこれらの設定を参照することもできます。

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// デフォルト設定のみをロード（パラメータなしの @KoinApplication と同じ）
@KoinApplication
class SimpleApp
```

:::info
- 空の `@Configuration` は `@Configuration("default")` と同等です
- 特定の設定が指定されていない場合、"default" 設定が自動的にロードされます
- アノテーション内にリストすることで、モジュールを複数の設定に所属させることができます
:::

## デフォルトモジュール (1.3.0 以降非推奨)

:::warning
デフォルトモジュールのアプローチは、Annotations 1.3.0 以降非推奨です。より適切な整理と明確化のために、`@Module` と `@Configuration` アノテーションを使用した明示的なモジュールを使用することをお勧めします。
:::

定義を使用する際、それらをモジュールに整理する必要がある場合とそうでない場合があります。以前は、明示的なモジュールなしで定義をホストするために、生成された「デフォルト」モジュールを使用することができました。

モジュールを指定したくない場合、Koin はすべての定義をホストするためのデフォルトモジュールを提供します。`defaultModule` は直接使用できる状態になっています。

```kotlin
// 以下のインポートにより、生成された拡張関数にアクセスできるようになります
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// または 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

**推奨されるアプローチ**: デフォルトモジュールを使用する代わりに、定義を明示的なモジュールに整理してください。

```kotlin
@Module
@Configuration
class MyModule {
    // ここに定義を記述
}

// その後 @KoinApplication を使用
@KoinApplication
object MyApp
```

:::info
`org.koin.ksp.generated.*` のインポートを忘れないでください。
:::

## @Module によるクラスモジュール

モジュールを宣言するには、クラスに `@Module` アノテーションを付与するだけです。

```kotlin
@Module
class MyModule
```

Koin でモジュールをロードするには、`@Module` クラスに対して生成された `.module` 拡張を使用します。モジュールの新しいインスタンス `MyModule().module` を作成するだけです。

```kotlin
// Koin Generation を使用
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> `org.koin.ksp.generated.*` のインポートを忘れないでください。

## @ComponentScan によるコンポーネントスキャン

アノテーションが付与されたコンポーネントをスキャンしてモジュールに集めるには、モジュールで `@ComponentScan` アノテーションを使用します。

```kotlin
@Module
@ComponentScan
class MyModule
```

これにより、現在のパッケージおよびサブパッケージからアノテーション付きコンポーネントがスキャンされます。`@ComponentScan("com.my.package")` のように特定のパッケージを指定してスキャンすることもできます。

:::info
`@ComponentScan` アノテーションを使用すると、KSP は同じパッケージを対象にすべての Gradle モジュールを横断してスキャンします。（1.4 以降）
:::

## クラスモジュール内での定義

コード内で直接定義を宣言するには、関数に定義用のアノテーションを付与します。

```kotlin
// 例 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **注意**: `@InjectedParam` (startKoin からの注入パラメータ用) および `@Property` (プロパティ注入用) も関数メンバで使用可能です。これらのアノテーションの詳細については、定義（definitions）のドキュメントを参照してください。

## モジュールの包含 (Including Modules)

他のクラスモジュールを自分のモジュールに含めるには、`@Module` アノテーションの `includes` 属性を使用します。

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

このようにして、ルートとなるモジュールだけを実行できます。

```kotlin
// Koin Generation を使用
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // ModuleB と ModuleA がロードされます
          ModuleB().module
        )
    }
}