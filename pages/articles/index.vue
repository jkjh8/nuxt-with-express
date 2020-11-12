<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>Articles</h1>
      <nuxt-link
        to="/articles/add"
        class="btn btn-success"
      >
        Add New
      </nuxt-link>
    </div>
    <hr>
    <div
      v-if="$route.params.created=='yes'"
      class="alert alert-success"
    >
      Record added successfully
    </div>
    <div
      v-if="$route.params.deleted=='yes'"
      class="alert alert-success"
    >
      Record deleted successfully
    </div>
    <div
      v-if="articles.length"
      class="list-group"
    >
      <nuxt-link
        v-for="article in articles"
        :key="article._id"
        class="list-group-item list-group-item-action"
        :to="'/articles/' + article._id"
      >
        {{ article.title }}
      </nuxt-link>
    </div>

    <div
      v-else
      class="alert alert-info"
    >
      No records found.
    </div>
  </div>
</template>

<script>
export default {
  async asyncData (context) {
    const { data } = await context.$axios.get('/api/articles')
    return {
      articles: data
    }
  }
}
</script>
