import Banner from '@/components/common/Banner'
import Container from '@/components/common/Container'
import Image from '@/components/common/Image'
import CustomLink from '@/components/common/Link'
import Pagination from '@/components/common/Pagination'
import { PageSEO } from '@/components/SEO'
import PictureGroupSkeleton from '@/components/Skeleton/PictureGroupSkeleton'
import constant from '@/data/constants'
import { categoriesDetailMetaData } from '@/data/siteMetadata'
import usePaginatedQuery from '@/hooks/usePaginatedQuery'
import comicsToJSON from '@/lib/toJSON/comicsToJSON'
import classNames from '@/lib/utils/classNames'
import { publicRoutes } from '@/lib/utils/getRoutes'
import { getCategories } from '@/services/categoryServices.js'
import { getComicsByCategory } from '@/services/comicService'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
const { motion } = require('framer-motion')

export async function getStaticProps({ params }) {
  try {
    const { categoryName: activeCategory } = params
    const options = { category: activeCategory }
    const staticComics = await getComicsByCategory({ params: options })
    const staticCategories = await getCategories()

    return {
      props: { staticComics, staticCategories, activeCategory },
      revalidate: parseInt(process.env.NEXT_PUBLIC_REVALIDATE_IN_1_HOUR),
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export async function getStaticPaths() {
  if (process.env.NODE_ENV === 'development') {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  let categories = await getCategories()
  categories = [{ id: null, name: 'All' }, ...categories]

  const paths = categories.map((category) => {
    const { name: categoryName } = category
    return {
      params: { categoryName },
    }
  })
  return {
    paths,
    fallback: 'blocking', // fallback to server-side-rendering if a page not rendered yet
  }
}

export default function CategoryDetailPage({ staticComics, staticCategories, activeCategory }) {
  return (
    <>
      <PageSEO
        title={categoriesDetailMetaData.title(activeCategory)}
        description={categoriesDetailMetaData.description}
      />
      <FilterNav categories={staticCategories} activeCategory={activeCategory} />
      <Container className="transform duration-500">
        <div className="relative px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-8 lg:pb-28">
          <div className="absolute inset-0">
            <div className="h-1/3 sm:h-2/3" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <BookmarkList
              initialComics={staticComics.results}
              totalRecords={staticComics.count}
              activeCategory={activeCategory}
              className="mx-auto mt-12 grid  grid-cols-responsive-card gap-5 lg:max-w-none"
            />
          </div>
        </div>
      </Container>
    </>
  )
}
function BookmarkList({ initialComics, totalRecords, activeCategory, className, limit }) {
  const pageSize = constant.COMIC_LIMIT
  const options = { category: activeCategory }
  const [comics, setComics] = useState(initialComics)
  const {
    currentPage,
    setCurrentPage,
    loading: isLoading,
    error,
  } = usePaginatedQuery(setComics, getComicsByCategory, null, options, comicsToJSON)

  const filterByCategory = (comics) => {
    if (activeCategory?.toLowerCase() === 'all') return comics
    return comics?.filter((comic) => {
      // some: tests whether at least one element in the array passes
      return comic?.categories.some(
        (category) => category.name.toLowerCase() === activeCategory.toLowerCase()
      )
    })
  }

  const filtered = filterByCategory(comics)

  return (
    <div>
      {isLoading ? (
        <div className={className}>
          {Array(12)
            .fill()
            .map((index) => {
              return (
                <article
                  key={index}
                  className="group relative max-w-[311px] transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <PictureGroupSkeleton height={211} hasIcon={false} />
                </article>
              )
            })}
        </div>
      ) : filtered?.length > 0 ? (
        <motion.div layout className={className}>
          {filtered.slice(0, limit).map((item, index) => (
            <BookmarkCard key={item.slug || item.id} index={index} {...item} />
          ))}
        </motion.div>
      ) : (
        <Banner title="No results found" description="No results found" />
      )}
      <Pagination
        className="pagination-bar mt-4"
        currentPage={currentPage}
        totalCount={totalRecords}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        isLoading={isLoading}
      />
    </div>
  )
}

function BookmarkCard(item) {
  return (
    <article className="group relative max-w-[311px] transform cursor-pointer duration-300 hover:-translate-y-1 hover:shadow-xl">
      <motion.div layout>
        <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
          <CustomLink
            href={publicRoutes.comicDetail.getDynamicPath(item.slug)}
            className="h-auto w-full transform overflow-hidden duration-200 hover:scale-110"
          >
            <Image
              width={311}
              height={145}
              className="h-48 w-full object-cover object-top"
              src={item.thumbnail}
              alt={item.title}
            />
          </CustomLink>
          <div className="flex flex-1 flex-col justify-between bg-white p-6">
            <div className="flex-1">
              <div className="flex flex-row space-x-2">
                {item.categories?.slice(0, 2).map((category) => (
                  <p key={category.id} className="text-sm font-medium text-indigo-600">
                    <CustomLink
                      href={publicRoutes.categories.getDynamicPath(category.name)}
                      className="hover:underline"
                    >
                      {category.name}
                    </CustomLink>
                  </p>
                ))}
              </div>
              <CustomLink
                href={publicRoutes.comicDetail.getDynamicPath(item.slug)}
                className="mt-2 block"
              >
                <p className="text-md font-semibold text-gray-900 line-clamp-2">{item.title}</p>
              </CustomLink>
            </div>
            {/* <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0"></div>
                    <div className="ml-3"></div>
                  </div> */}
          </div>
        </div>
      </motion.div>
    </article>
  )
}

function FilterNav({ categories, activeCategory }) {
  const allCategory = { id: null, name: 'All' }
  const router = useRouter()

  if (categories) categories = [allCategory, ...categories]

  const handleRedirect = (event) => {
    event.preventDefault()
    router.push(event.target.value)
  }

  return (
    <nav className="mx-4 flex min-h-[64px] lg:mx-0 lg:space-x-8 lg:px-8" aria-label="Global">
      <div className="mx-auto mt-8 w-full sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => handleRedirect(event)}
        >
          {categories?.map((category) => (
            <option key={category.id} value={publicRoutes.categories.getDynamicPath(category.name)}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <ScrollContainer className="scroll-container cursor-pointer">
            <nav className="-mb-px flex max-w-[90vw] space-x-8" aria-label="Tabs">
              {categories?.map((category) => (
                <CustomLink
                  key={category.name}
                  href={publicRoutes.categories.getDynamicPath(category.name)}
                  className={classNames(
                    activeCategory.toLowerCase() === category.name.toLowerCase()
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                  )}
                  aria-current={
                    activeCategory.toLowerCase() === category.name.toLowerCase()
                      ? 'page'
                      : undefined
                  }
                >
                  {category.name}
                </CustomLink>
              ))}
            </nav>
          </ScrollContainer>
        </div>
      </div>
    </nav>
  )
}
