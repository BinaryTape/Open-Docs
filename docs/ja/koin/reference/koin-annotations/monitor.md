---
title: @Monitor を使用したKoinの組み込みパフォーマンスモニタリング
---

`@Monitor` アノテーション (Koin Annotations 2.2.0以降で利用可能) は、Koinの公式ツーリングプラットフォームである[Kotzilla Platform](https://kotzilla.io)を介して、Koinコンポーネントの自動パフォーマンスモニタリングとトレースを可能にします。

## セットアップ

Kotzilla SDKの依存関係を追加します:

```kotlin
dependencies {
    implementation "io.kotzilla:kotzilla-core:latest.version"
}
```

Kotzillaドキュメントで[最新バージョン](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)を確認してください。

`@Monitor`対象クラスを拡張可能にするために、`allOpen`プラグインを設定します:

```kotlin
plugins {
    id "org.jetbrains.kotlin.plugin.allopen"
}

allOpen {
    annotation("org.koin.core.annotation.Monitor")
}
```

Koinの設定でKotzillaアナリティクスを初期化します:

```kotlin
import io.kotzilla.sdk.analytics.koin.analytics

fun initKoin() {
    startKoin {
        // Kotzillaモニタリングを有効にする
        analytics()
        modules(appModule)
    }
}
```

## 基本的な使用方法

Koinコンポーネントに`@Monitor`アノテーションを付けるだけです:

```kotlin
@Monitor
@Single
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
    
    suspend fun createUser(userData: UserData): User {
        return userRepository.save(userData)
    }
}
```

## 生成されるコード

コンパイラは、コンポーネントをラップするプロキシクラスを自動的に生成します:

```kotlin
/**
 * @Monitor によって生成 - 'UserService' 用 Koin プロキシ
 */
class UserServiceProxy(userRepository: UserRepository) : UserService(userRepository) {
    override fun findUser(id: String): User? { 
        return KotzillaCore.getDefaultInstance().trace("UserService.findUser") { 
            super.findUser(id) 
        } 
    }
    
    override suspend fun createUser(userData: UserData): User { 
        return KotzillaCore.getDefaultInstance().suspendTrace("UserService.createUser") { 
            super.createUser(userData) 
        } 
    }
}
```

Koinは元のクラスの代わりにプロキシを自動的に使用し、以下の情報を透過的に取得します:
- メソッドの実行時間
- 呼び出し頻度とパターン
- エラー率と種類
- パフォーマンスのボトルネック

## ViewModelのモニタリング

ViewModelを監視して、UIパフォーマンスを追跡します:

```kotlin
@Monitor
@KoinViewModel
class DetailViewModel(private val repository: Repository) : ViewModel() {
    fun loadData(id: String): StateFlow<Data> = repository.getData(id)
}
```

## Kotzillaプラットフォームとの統合

モニタリングデータは自動的に[Kotzilla Platform](https://kotzilla.io)ワークスペースに送信され、以下を提供します:

- **リアルタイムパフォーマンスダッシュボード**: メソッドの実行時間と傾向を表示
- **エラー追跡**: 例外発生率とスタックトレースを監視
- **使用状況分析**: どのコンポーネントが最も頻繁に使用されているかを把握
- **パフォーマンスアラート**: パフォーマンスの劣化を通知

無料のKotzillaアカウントを作成し、`kotzilla.json`ファイルにAPIキーを設定します:

```json
{
  "sdkVersion": "latest.version",
  "keys": [
    {
      "appId": "your-app-id",
      "applicationPackageName": "com.example.app",
      "keyId": "your-key-id", 
      "apiKey": "your-api-key"
    }
  ]
}
```

## 要件

- `@Monitor`でアノテーションされたクラスはopenである必要があります (`allOpen`プラグインによって自動的に処理されます)
- Kotzilla SDKの依存関係が実行時に利用可能である必要があります
- データ収集には有効なKotzilla PlatformアカウントとAPIキーが必要です

:::info
`@Monitor`アノテーションは、監視対象クラス自体のメソッド呼び出しのみを追跡します。監視対象クラスに注入された依存関係は、それら自体も`@Monitor`でアノテーションされていない限り、自動的には監視されません。
:::

:::note
完全なセットアップ手順と高度な設定オプションについては、[Kotzillaドキュメント](https://doc.kotzilla.io)を参照してください。
:::