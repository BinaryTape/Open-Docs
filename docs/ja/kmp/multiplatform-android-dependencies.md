[//]: # (title: Androidの依存関係を追加する)

KotlinマルチプラットフォームモジュールにAndroid固有の依存関係を追加するワークフローは、純粋なAndroidプロジェクトの場合と同じです。Gradleファイルで依存関係を宣言し、プロジェクトをインポートします。その後、Kotlinコードでこの依存関係を使用できます。

KotlinマルチプラットフォームプロジェクトでAndroidの依存関係を宣言するには、特定のAndroidソースセットに追加することをお勧めします。そのためには、プロジェクトの`shared`ディレクトリにある`build.gradle(.kts)`ファイルを更新してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        androidMain.dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    } 
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        androidMain {
            dependencies {
                implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</tab>
</tabs>

Androidプロジェクトでトップレベルの依存関係だったものをマルチプラットフォームプロジェクトの特定のソースセットに移動する場合、そのトップレベルの依存関係が複雑な構成名を持っていた場合、困難になることがあります。例えば、Androidプロジェクトのトップレベルから`debugImplementation`依存関係を移動するには、`androidDebug`という名前のソースセットに`implementation`依存関係を追加する必要があります。このような移行の問題に対処するための労力を最小限に抑えるために、`androidTarget {}`ブロック内に`dependencies {}`ブロックを追加できます。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</tab>
</tabs>

ここで宣言された依存関係は、トップレベルのブロックからの依存関係と全く同じように扱われますが、このように宣言することで、ビルドスクリプト内でAndroidの依存関係が視覚的に分離され、より分かりやすくなります。

スクリプトの最後に、Androidプロジェクトで慣例的に行われる方法で、依存関係をスタンドアロンの`dependencies {}`ブロックに配置することもサポートされています。ただし、この方法は強く**推奨しません**。なぜなら、Androidの依存関係をトップレベルのブロックに、他のターゲットの依存関係を各ソースセットに構成すると、混乱を引き起こす可能性が高いためです。

## 次のステップ

マルチプラットフォームプロジェクトでの依存関係の追加に関する他のリソースを確認し、以下について詳しく学びましょう：

*   [Android公式ドキュメントでの依存関係の追加](https://developer.android.com/studio/build/dependencies)
*   [マルチプラットフォームライブラリや他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies.md)
*   [iOS依存関係の追加](multiplatform-ios-dependencies.md)